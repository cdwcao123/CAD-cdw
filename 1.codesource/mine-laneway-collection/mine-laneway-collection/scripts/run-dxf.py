"""Run DXF tools with installed ezdxf, matching bundled wheels, or a standard-library fallback."""
import glob
import importlib.util
import os
from pathlib import Path
import platform
import runpy
import subprocess
import sys
import tempfile
import zipfile


def run_script(script, args, extra_path=None):
    if extra_path:
        sys.path.insert(0, extra_path)
    sys.argv = [str(script), *args]
    runpy.run_path(str(script), run_name="__main__")


def installed_ezdxf():
    try:
        if importlib.util.find_spec("ezdxf") is None:
            return False
        import ezdxf  # noqa: F401
        return True
    except Exception:
        return False


def bundled_patterns():
    if sys.platform != "win32" or platform.machine().lower() not in ("amd64", "x86_64"):
        return None
    tag = f"cp{sys.version_info.major}{sys.version_info.minor}"
    return [
        f"ezdxf-*-{tag}-{tag}-win_amd64.whl",
        f"numpy-*-{tag}-{tag}-win_amd64.whl",
        f"fonttools-*-{tag}-{tag}-win_amd64.whl",
        "pyparsing-*-py3-none-any.whl",
        "typing_extensions-*-py3-none-any.whl",
    ]


if len(sys.argv) >= 3 and sys.argv[1] == "--run":
    run_script(Path(__file__).with_name("dxf_tools.py"), sys.argv[3:], extra_path=sys.argv[2])
    raise SystemExit(0)

if sys.version_info < (3, 10):
    raise SystemExit("Python 3.10 or newer is required")

args = sys.argv[1:]
renderer = os.environ.get("MINE_DXF_RENDERER", "auto").strip().lower()
tools = Path(__file__).resolve().with_name("dxf_tools.py")
fallback = Path(__file__).resolve().with_name("dxf_fallback.py")

if renderer in ("auto", "ezdxf") and installed_ezdxf():
    run_script(tools, args)
    raise SystemExit(0)

patterns = bundled_patterns()
if renderer in ("auto", "ezdxf") and patterns:
    wheels = Path(__file__).resolve().parent.parent / "vendor" / "wheels"
    matches = [glob.glob(str(wheels / pattern)) for pattern in patterns]
    if all(len(items) == 1 for items in matches):
        with tempfile.TemporaryDirectory(prefix="mine-dxf-deps-") as site:
            for pattern_matches in matches:
                with zipfile.ZipFile(pattern_matches[0]) as wheel:
                    wheel.extractall(site)
            result = subprocess.run(
                [sys.executable, __file__, "--run", site, *args],
                check=False,
                env={**os.environ, "PYTHONNOUSERSITE": "1"},
            )
            raise SystemExit(result.returncode)

if renderer == "ezdxf":
    raise SystemExit(
        "ezdxf is not available for this Python. Install ezdxf in the selected Python >=3.10 "
        "or use MINE_DXF_RENDERER=auto/basic."
    )

run_script(fallback, args)
