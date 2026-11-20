window.__MC_EDITOR_CONFIG__ = {
  // 顶部模块（中间）
  topModules: [
    {
      label: '默认',
      key: 'defaultModuleData',
      children: [
        {
          label: '绘图',
          key: 'drawKey',
          icon: 'mc-huituduobianxing',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              [
                {
                  label: '直线',
                  key: 'line',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  detailToolTip: [
                    { text: '创建直线段', isDelay: false },
                    { text: '使用 LINE 命令，可以创建一系列连续的直线段。每条线段都是可以单独进行编辑的直线对象。' },
                    { imgUrl: '/toolTipImgs/draw/line.png' },
                  ],
                  icon: 'mc-huituzhixian',
                  desc: '直线',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'LINE',
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '圆',
                  key: 'circle',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-huituyuan',
                  desc: '圆心,半径',
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  detailToolTip: [
                    { text: '用圆心和半径创建圆', isDelay: false },
                    { imgUrl: '/toolTipImgs/draw/polygon.png' },
                  ],
                  // detailToolTip: getToolTipContonet(),
                  action: 'CIRCLE',
                  activeMenuKey: ['circle'],
                  menuOptions: [
                    {
                      label: '',
                      key: 'circle',
                      value: '',
                      icon: 'mc-huituyuan',
                      desc: '圆心,半径',
                      action: 'CIRCLE',
                      detailToolTip: [
                        { text: '用圆心和半径创建圆', isDelay: false },
                        { imgUrl: '/toolTipImgs/draw/polygon.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'circleDiameter',
                      value: '',
                      icon: 'mc-huituyuanyuanxinzhijing',
                      desc: '圆心,直径',
                      divider: true,
                      action: 'CD',
                      detailToolTip: [
                        { text: '用圆心和直径创建圆', isDelay: false },
                        { imgUrl: '/toolTipImgs/draw/circleDiameter.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'circle2Points',
                      value: '',
                      icon: 'mc-huituyuanliangdian',
                      desc: '两点',
                      action: 'C2P',
                      detailToolTip: [
                        { text: '用直径的两个端点创建圆', isDelay: false },
                        { imgUrl: '/toolTipImgs/draw/circle2Points.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'circle3Points',
                      value: '',
                      icon: 'mc-huituyuansandian',
                      desc: '三点',
                      divider: true,
                      action: 'C3P',
                      detailToolTip: [
                        { text: '用圆周上的三个点创建圆', isDelay: false },
                        { imgUrl: '/toolTipImgs/draw/circle3Points.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'drawCircleByTangent',
                      value: '',
                      icon: 'mc-huituyuanqieqiebanjing',
                      desc: '相切、相切、半径',
                      action: 'TTR',
                      detailToolTip: [
                        { text: '以指定半径创建相切于两个对象的圆', isDelay: false },
                        { imgUrl: '/toolTipImgs/draw/drawCircleByTangent.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'drawCircleTangentToThreeCircles',
                      value: '',
                      icon: 'mc-huituyuanqieqieqie',
                      desc: '相切、相切、相切',
                      action: 'TTT',
                      detailToolTip: [
                        { text: '创建相切于三个对象的圆', isDelay: false },
                        { imgUrl: '/toolTipImgs/draw/drawCircleTangentToThreeCircles.png' },
                      ],
                    },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
                {
                  label: '圆环',
                  key: 'circleRing',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-huituyuanhuan',
                  desc: '圆环',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'DONUT',
                  detailToolTip: [
                    { text: '创建实心圆或较宽的环', isDelay: false },
                    { text: '圆环由两条圆弧多段线组成，这两条圆弧多段线首尾相接而形成圆形。多段线的宽度由指定的内直径和外直径决定。要创建实心的圆，请将内径值指定为零。' },
                    { imgUrl: '/toolTipImgs/draw/circleRing.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
              [
                {
                  label: '多段线',
                  key: 'polyline',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-huituduoduanxian',
                  desc: '多段线',
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  action: 'PLINE',
                  activeMenuKey: ['polyline'],
                  detailToolTip: [
                    { text: '创建二维多段线', isDelay: false },
                    { text: '二维多段线是作为单个平面对象创建的相互连接的线段序列。可以创建直线段、圆弧段或两者的组合线段。' },
                    { imgUrl: '/toolTipImgs/draw/polyline.png' },
                  ],
                  menuOptions: [
                    {
                      label: '多段线',
                      key: 'polyline',
                      value: '',
                      isChangeLabel: true,
                      icon: 'mc-huituduoduanxian',
                      desc: '多段线',
                      detailToolTip: [
                        { text: '创建二维多段线', isDelay: false },
                        { text: '二维多段线是作为单个平面对象创建的相互连接的线段序列。可以创建直线段、圆弧段或两者的组合线段。' },
                        { imgUrl: '/toolTipImgs/draw/polyline.png' },
                      ],
                      action: 'PLINE',
                    },
                    {
                      label: '三维线',
                      key: 'threeDimensionalPolyline',
                      value: '',
                      detailToolTip: [
                        { text: '创建三维多段线', isDelay: false },
                        { text: '三维多段线是作为单个对象创建的直线段相互连接而成的序列。' },
                        { text: '三维多段线可以不共面，但是不能包括圆弧段。' },
                        { imgUrl: '/toolTipImgs/draw/polyline3d.png' },
                      ],
                      isChangeLabel: true,
                      icon: 'mc-sanweiduoduanxian',
                      desc: '三维多段线',
                      action: '3DPOLY',
                    },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
                {
                  label: '椭圆',
                  key: 'ellipse',
                  value: true,
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-huitutuoyuan',
                  desc: '椭圆',
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  action: 'ELLIPSE',
                  activeMenuKey: ['ellipse'],
                  detailToolTip: [
                    { text: '用指定的中心点创建椭圆', isDelay: false },
                    { text: '使用中心点、第一个轴的端点和第二个轴的长度来创建椭圆。可以通过单击所需距离处的某个位置或输入长度值来指定距离。' },
                    { imgUrl: '/toolTipImgs/draw/ellipse.png' },
                  ],
                  menuOptions: [
                    {
                      label: '椭圆',
                      key: 'ellipse',
                      value: true,
                      isChangeLabel: true,
                      icon: 'mc-huitutuoyuan',
                      desc: '圆心',
                      action: 'ELLIPSE',
                      detailToolTip: [
                        { text: '用指定的中心点创建椭圆', isDelay: false },
                        { text: '使用中心点、第一个轴的端点和第二个轴的长度来创建椭圆。可以通过单击所需距离处的某个位置或输入长度值来指定距离。' },
                        { imgUrl: '/toolTipImgs/draw/ellipse.png' },
                      ],
                    },
                    {
                      label: '椭圆',
                      key: 'ellipse2Points',
                      value: false,
                      isChangeLabel: true,
                      icon: 'mc-tuoyuanzhouduandian',
                      desc: '轴，端点',
                      detailToolTip: [
                        { text: '创建椭圆或椭圆弧', isDelay: false },
                        { text: '椭圆上的前两个点确定第一条轴的位置和长度。第三个点确定椭圆的圆心与第二条轴的端点之间的距离。' },
                        { imgUrl: '/toolTipImgs/draw/ellipse2Points.png' },
                      ],
                      action: 'ELLIPSE',
                    },
                    {
                      label: '椭圆弧',
                      key: 'ellipseArc',
                      value: '',
                      isChangeLabel: true,
                      icon: 'mc-tuoyuanhu',
                      desc: '椭圆弧',
                      action: 'ELLIPSEARC',
                      detailToolTip: [
                        { text: '创建椭圆弧', isDelay: false },
                        { text: '椭圆弧上的前两点确定第一条轴的位置和长度。第三个点确定椭圆弧的圆心与第二条轴的端点之间的距离。第四个点和第五个点确定起点和端点角度。' },
                        { imgUrl: '/toolTipImgs/draw/ellipseArc.png' },
                      ],
                    },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
                {
                  label: '单点',
                  key: 'selectPoint',
                  value: '',
                  icon: 'mc-huitudian',
                  desc: '单点',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  activeMenuKey: ['selectPoint'],
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  action: 'POINT',
                  detailToolTip: [
                    { text: '创建一个点对象', isDelay: false },
                    { imgUrl: '/toolTipImgs/draw/selectPoint.png' },
                  ],
                  menuOptions: [
                    {
                      label: '单点',
                      key: 'selectPoint',
                      value: '',
                      isChangeLabel: true,
                      icon: 'mc-huitudian',
                      desc: '单点',
                      action: 'POINT',
                      detailToolTip: [
                        { text: '创建一个点对象', isDelay: false },
                        { imgUrl: '/toolTipImgs/draw/selectPoint.png' },
                      ],
                    },
                    {
                      label: '多点',
                      desc: '多点',
                      value: '',
                      isChangeLabel: true,
                      key: 'points',
                      icon: 'mc-huituduodian',
                      action: 'POINTS',
                      detailToolTip: [
                        { text: '创建多个点对象', isDelay: false },
                        { imgUrl: '/toolTipImgs/draw/points.png' },
                      ],
                    },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
              ],
              [
                {
                  label: '矩形',
                  key: 'circleRectangle',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-huitujuxing',
                  desc: '矩形',
                  detailToolTip: [
                    { text: '创建矩形多段线', isDelay: false },
                    { text: '从指定的矩形参数创建矩形多段线(长度、宽度、旋转角度)和角点类型(圆角、倒角或直角)。' },
                    { imgUrl: '/toolTipImgs/draw/rectangle.png' },
                  ],
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'RECTANG',
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '圆弧',
                  key: 'arcLine3Points',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  value: '',
                  icon: 'mc-huituyuanhu',
                  desc: '圆弧',
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  detailToolTip: [
                    { text: '用三点创建圆弧', isDelay: false },
                    { imgUrl: '/toolTipImgs/draw/arcLine3Points.png' },
                  ],
                  activeMenuKey: ['arcLine3Points'],
                  action: 'A3P',
                  menuOptions: [
                    {
                      label: '',
                      key: 'arcLine3Points',
                      value: '',
                      icon: 'mc-huituyuanhu',
                      desc: '三点',
                      action: 'A3P',
                      detailToolTip: [
                        { text: '用三点创建圆弧', isDelay: false },
                        { imgUrl: '/toolTipImgs/draw/arcLine3Points.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'drawArcByContinue',
                      value: '',
                      icon: 'mc-huituyuanhulianxu',
                      desc: '连续绘制圆弧',
                      divider: true,
                      action: 'ACA',
                      detailToolTip: [
                        { text: '创建圆弧使其相切于上一次绘制的直线或圆弧', isDelay: false },
                        { text: '创建直线或圆弧后，通过在“指定起点“提示下启动 ACA 命令并按ENTER 键，可以立即绘制一个在端点处相切的圆弧。只需指定圆弧的端点。' },
                        { imgUrl: '/toolTipImgs/draw/drawArcByContinue.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'arcLine',
                      value: '',
                      icon: 'mc-huizhiyuanhuxinduanhu',
                      desc: '圆心,端点,弧度',
                      action: 'ARC',
                      detailToolTip: [
                        { text: '用圆心、起点和包含弧度创建圆弧', isDelay: false },
                        { text: '起点和圆心之间的距离确定半径。圆弧的另一端通过指定将圆弧的圆心用作顶点的弧度来确定。' },
                        { text: '所得圆弧始终从起点按逆时针绘制。' },
                        { imgUrl: '/toolTipImgs/draw/arcLine.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'drawArcByCenterStartEnd',
                      value: '',
                      icon: 'mc-huituyuanhuxinqiduan',
                      desc: '圆心,起点,端点',
                      action: 'CSE',
                      detailToolTip: [
                        { text: '用圆心、起点和用于确定端点的第三个点创建圆弧', isDelay: false },
                        { text: '起点和圆心之间的距离确定半径。端点由从圆心引出的通过第三点的直线决定。' },
                        { text: '所得圆弧始终从起点按逆时针绘制。' },
                        { imgUrl: '/toolTipImgs/draw/drawArcByCenterStartEnd.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'drawArcByCenterStartChordLength',
                      value: '',
                      icon: 'mc-huituyuanhuxinqichang',
                      desc: '圆心,起点,长度',
                      divider: true,
                      action: 'CSC',
                      detailToolTip: [
                        { text: '用圆心、起点和弦长创建圆弧', isDelay: false },
                        { text: '起点和圆心之间的距离确定半径。圆弧的另一端通过指定圆弧的起点与端点之间的弦长来确定' },
                        { text: '所得圆弧始终从起点按逆时针绘制。' },
                        { imgUrl: '/toolTipImgs/draw/drawArcByCenterStartChordLength.png' },
                      ],
                    }, {
                      label: '',
                      key: 'drawArcByStartCenterEnd',
                      value: '',
                      icon: 'mc-huituyuanhuqixinduan  ',
                      desc: '起点,圆心,端点',
                      action: 'SCE',
                      detailToolTip: [
                        { text: '用起点、圆心和端点创建圆弧', isDelay: false },
                        { text: '起点和圆心之间的距离确定半径。端点由从圆心引出的通过第三点的直线决定。' },
                        { text: '所得圆弧始终从起点按逆时针绘制。' },
                        { imgUrl: '/toolTipImgs/draw/drawArcByStartCenterEnd.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'drawArcByStartCenterAngle',
                      value: '',
                      icon: 'mc-huituyuanhuqixinjiao',
                      desc: '起点,圆心,角度',
                      action: 'SCA',
                      detailToolTip: [
                        { text: '用起点、圆心和包含角创建圆弧', isDelay: false },
                        { text: '起点和圆心之间的距离确定半径。圆弧的另一端通过指定将圆弧的圆心用作顶点的夹角来确定。' },
                        { text: '所得圆弧始终从起点按逆时针绘制。' },
                        { imgUrl: '/toolTipImgs/draw/drawArcByStartCenterAngle.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'drawArcByStartCenterChordLength',
                      value: '',
                      icon: 'mc-huituyuanhuqixinchang',
                      desc: '起点,圆心,长度',
                      divider: true,
                      action: 'SCC',
                      detailToolTip: [
                        { text: '用起点、圆心和弦长创建圆弧', isDelay: false },
                        { text: '起点和圆心之间的距离确定半径。圆弧的另一端通过指定圆弧的起点与端点之间的弦长来确定。' },
                        { text: '所得圆弧始终从起点按逆时针绘制。' },
                        { imgUrl: '/toolTipImgs/draw/drawArcByStartCenterChordLength.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'drawArcByStartEndAngle',
                      value: '',
                      icon: 'mc-huituyuanhuqiduanjiao',
                      desc: '起点,端点,角度',
                      action: 'SEA',
                      detailToolTip: [
                        { text: '用起点、端点和包含角创建圆弧', isDelay: false },
                        { text: '圆弧端点之间的夹角确定圆弧的圆心和半径。' },
                        { imgUrl: '/toolTipImgs/draw/drawArcByStartEndAngle.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'drawArcByStartEndDirection',
                      value: '',
                      icon: 'mc-huituyuanhuqiduanfangxiang',
                      desc: '起点,端点,方向',
                      action: 'SED',
                      detailToolTip: [
                        { text: '用起点、端点和起点处的切线方向创建圆弧', isDelay: false },
                        { text: '可以通过在所需切线上指定一个点或输入角度指定切向。通过更改指定两个端点的顺序，可以确定哪个端点控制切线。' },
                        { imgUrl: '/toolTipImgs/draw/drawArcByStartEndDirection.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'drawArcByStartEndRadius',
                      value: '',
                      icon: 'mc-huituyuanhuqiduanbanjing',
                      desc: '起点,端点,半径',
                      action: 'SER',
                      detailToolTip: [
                        { text: '用起点、端点和半径创建圆弧', isDelay: false },
                        { text: '圆弧凸度的方向由指定其端点的顺序确定。可以通过输入半径或在所需半径距离上指定一个点来指定半径。' },
                        { imgUrl: '/toolTipImgs/draw/drawArcByStartEndRadius.png' },
                      ],
                    },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
                {
                  label: '实线',
                  key: 'solidLine',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-shixian',
                  desc: '实线',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'SOLID',
                  detailToolTip: [
                    { text: '创建一条实线对象', isDelay: false },
                    { imgUrl: '/toolTipImgs/draw/solidLine.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
              [
                {
                  label: '多边形',
                  desc: '多边形',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  key: 'moreRectangle',
                  value: '',
                  detailToolTip: [
                    { text: '创建等边闭合多段线', isDelay: false },
                    { text: '可以指定多边形的各种参数，包含边数。显示了内接和外切选项间的差别。' },
                    { imgUrl: '/toolTipImgs/draw/polygon.png' },
                  ],
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  icon: 'mc-huituduobianxing',
                  action: 'POLYGON',
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '填充',
                  key: 'pattern',
                  value: 'pattern',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-huitutuantianchong',
                  desc: ' 图案填充',
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  activeMenuKey: ['pattern'],
                  action: 'HATCH',
                  detailToolTip: [
                    { text: '使用填充图案或填充对封闭区域或选定对象进行填充', isDelay: false },
                    { text: '从多个方法中进行选择以指定图案填充的边界。' },
                    { text: ' · 指定对象封闭的区域中的点。' },
                    { text: ' · 选择封闭区域的对象。' },
                    { text: ' · 将填充图案从工具选项板或设计中心拖动到封闭区域。' },
                    { imgUrl: '/toolTipImgs/draw/fillPolygon.png' },
                  ],
                  menuOptions: [
                    {
                      label: '',
                      key: 'pattern',
                      icon: 'mc-huitutuantianchong',
                      action: 'HATCH',
                      value: 'pattern',
                      desc: '图案填充',
                      detailToolTip: [
                        { text: '使用填充图案或填充对封闭区域或选定对象进行填充', isDelay: false },
                        { text: '从多个方法中进行选择以指定图案填充的边界。' },
                        { text: ' · 指定对象封闭的区域中的点。' },
                        { text: ' · 选择封闭区域的对象。' },
                        { text: ' · 将填充图案从工具选项板或设计中心拖动到封闭区域。' },
                        { imgUrl: '/toolTipImgs/draw/fillPolygon.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'gradient',
                      icon: 'mc-huitujianbiantianchong',
                      action: 'GRADIENT',
                      value: 'gradient',
                      desc: ' 渐变色',
                      detailToolTip: [
                        { text: '使用渐变填充对封闭区域或选定对象进行填充', isDelay: false },
                        { text: '渐变填充创建一种或两种颜色间的平滑转场。' },
                        { imgUrl: '/toolTipImgs/draw/gradient.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'boundary',
                      icon: 'mc-huitubianjie',
                      action: 'BOUNDARY',
                      value: 'boundary',
                      desc: ' 边界',
                      detailToolTip: [
                        { text: '用封闭区域创建面域或多段线', isDelay: false },
                        { text: '指定的内部点使用周围的对象来创建单独的面域或多段线。' },
                        { imgUrl: '/toolTipImgs/draw/boundary.png' },
                      ],
                    },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
                {
                  desc: '多行线',
                  label: '多行线',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  key: 'multiLine',
                  icon: 'mc-huituduoxian',
                  action: 'MLINE',
                  detailToolTip: [
                    { text: '创建一条多行线对象', isDelay: false },
                    { imgUrl: '/toolTipImgs/draw/multiLine.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
            ],
            [
              [
                {
                  label: '螺旋',
                  key: 'spiralLine',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-luoxuanxian',
                  desc: '螺旋',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'HELIX',
                  detailToolTip: [
                    { text: '创建二维螺旋或三维弹簧', isDelay: false },
                    { text: '将螺旋用作创建弹簧、螺纹和环形楼梯。' },
                    { imgUrl: '/toolTipImgs/draw/spiralLine.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
              [
                {
                  label: '构造线',
                  key: 'constructLine',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-huitugouzaoxian',
                  desc: '构造线',
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  action: 'XLINE',
                  activeMenuKey: ['constructLine'],
                  detailToolTip: [
                    { text: '创建无限长的线', isDelay: false },
                    { text: '可以使用无限延伸的线(例如构造线)来创建构造和参考线，并且其可用于修剪边界。' },
                    { imgUrl: '/toolTipImgs/draw/constructLine.png' },
                  ],
                  menuOptions: [
                    {
                      label: '构造线',
                      key: 'constructLine',
                      value: '',
                      isChangeLabel: true,
                      icon: 'mc-huitugouzaoxian',
                      desc: '构造线',
                      action: 'XLINE',
                      detailToolTip: [
                        { text: '创建无限长的线', isDelay: false },
                        { text: '可以使用无限延伸的线(例如构造线)来创建构造和参考线，并且其可用于修剪边界。' },
                        { imgUrl: '/toolTipImgs/draw/constructLine.png' },
                      ],
                    },
                    {
                      desc: '射线',
                      label: '射线',
                      isChangeLabel: true,
                      value: '',
                      key: 'rayLine',
                      icon: 'mc-huitushexian',
                      action: 'RAY',
                      detailToolTip: [
                        { text: '创建开始于一点并无限延伸的线', isDelay: false },
                        { text: '向一个方向无限延伸的直线(称为射线)，可用作创建其他对象的参照。' },
                        { imgUrl: '/toolTipImgs/draw/rayLine.png' },
                      ],
                    },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
              ],
              [
                {
                  label: '面域',
                  key: 'faceArea',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-mianyu',
                  desc: '面域',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'REGION',
                  detailToolTip: [
                    { text: '将包含封闭区域的对象转换为面域对象', isDelay: false },
                    { text: '面域是用闭合的形状或环创建的二维区域。闭合多段线、闭合的多条直线和闭合的多条曲线都是有效的选择对象。曲线包括圆弧、圆、椭圆弧、椭圆和样条曲线。' },
                    { text: '可以将若干区域合并到单个复杂区域.' },
                    { imgUrl: '/toolTipImgs/draw/faceArea.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
              [
                {
                  label: '云线',
                  key: 'cloudLine',
                  value: '矩形',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-yunxian',
                  desc: '矩形',
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  action: 'REVCLOUD',
                  detailToolTip: [
                    { text: '通过绘制矩形创建云线。', isDelay: false },
                    { text: '您可以通过指定两个角点创建新的云线，也可以将闭合对象(例如椭圆)转换为云线。使用云线亮显要查看的图形部分。' },
                    { imgUrl: '/toolTipImgs/draw/cloudLine.png' },
                  ],
                  activeMenuKey: ['cloudLine'],
                  menuOptions: [
                    {
                      label: '',
                      key: 'cloudLine',
                      value: '矩形',
                      iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                      icon: 'mc-yunxian',
                      desc: '矩形',
                      action: 'REVCLOUD',
                      detailToolTip: [
                        { text: '通过绘制矩形创建云线。', isDelay: false },
                        { text: '您可以通过指定两个角点创建新的云线，也可以将闭合对象(例如椭圆)转换为云线。使用云线亮显要查看的图形部分。' },
                        { imgUrl: '/toolTipImgs/draw/cloudLine.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'polygonCloudLine',
                      value: '多边形',
                      iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                      icon: 'mc-yunxian_duobianxing',
                      desc: '多边形',
                      action: 'REVCLOUD',
                      detailToolTip: [
                        { text: '通过绘制多段线创建修订云线。', isDelay: false },
                        { text: '您可以通过指定点创建新的修订云线，也可以将闭合对象(例如椭圆)转换为修订云线。使用修订云线亮显要查看的图形部分。' },
                        { imgUrl: '/toolTipImgs/draw/cloudLine.png' },
                      ],
                    },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
              ],
            ],
            [
              [
                { // 定距等分
                  // mc-dingjudengfen
                  key: 'equalDistance',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  label: '定距等分',
                  icon: 'mc-dingjudengfen',
                  desc: '定距等分',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'DIVIDEBYDISTANCE',
                  detailToolTip: [
                    { text: '定距等分', isDelay: false },
                    { imgUrl: '/toolTipImgs/draw/equalDistance.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
              [    // 定数等分
                //mc-dingshudengfen
                {
                  key: 'equalNumber',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  label: '定数等分',
                  icon: 'mc-dingshudengfen',
                  desc: '定数等分',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'DIVIDE',
                  detailToolTip: [
                    { text: '定数等分', isDelay: false },
                    { imgUrl: '/toolTipImgs/draw/equalNumber.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
              [

                {
                  key: 'lineCurvenhPoints',
                  value: 1,
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  label: '样条曲线',
                  icon: 'mc-huituyangtiaoquxiankongzhidian',
                  desc: '样条曲线',
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  action: 'SPLINE',
                  activeMenuKey: ['lineCurvenhPoints'],
                  detailToolTip: [
                    { text: '使用控制点绘制样条曲线', isDelay: false },
                    { imgUrl: '/toolTipImgs/draw/lineCurvenhPoints.png' },
                  ],
                  menuOptions: [
                    {
                      label: '',
                      key: 'lineCurvenhPoints',
                      value: 1,
                      icon: 'mc-huituyangtiaoquxiankongzhidian',
                      desc: '控制点',
                      action: 'SPLINE',
                      detailToolTip: [
                        { text: '使用控制点绘制样条曲线', isDelay: false },
                        { imgUrl: '/toolTipImgs/draw/lineCurvenhPoints.png' },
                      ],
                    },
                    {
                      label: '',
                      key: 'rectangleRing',
                      value: 0,
                      icon: 'mc-huituyangtiaoquxiannihe',
                      desc: '拟合点',
                      action: 'SPLINE',
                      detailToolTip: [
                        { text: '使用拟合点绘制样条曲线', isDelay: false },
                        { imgUrl: '/toolTipImgs/draw/rectangleRing.png' },
                      ],
                    },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
              ],
            ],
          ],
        },
        {
          label: '修改',
          key: 'modifyKey',
          icon: 'mc-xiugaiyidong',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              [
                {
                  label: '移动',
                  key: 'move',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-xiugaiyidong',
                  desc: '移动',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'MOVE',
                  detailToolTip: [
                    { text: '将对象在指定方向上移动指定距离', isDelay: false },
                    { text: '使用坐标、栅格捕捉、对象捕捉和其他工具可以精确移动对象。' },
                    { imgUrl: '/toolTipImgs/modify/move.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '复制',
                  key: 'copy',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-xiugaifuzhi',
                  desc: '复制',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'COPY',
                  detailToolTip: [
                    { text: '将对象复制到指定方向上的指定距离处', isDelay: false },
                    // { text: '使用 COPYMODE 系统变量，可以控制是否自动创建多个副本。' },
                    { imgUrl: '/toolTipImgs/modify/copy.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                [
                  {
                    label: '',
                    key: 'stretching',
                    iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                    value: '',
                    type: window.MCEDITOR.TopMenuType.ICON,
                    desc: ' 拉伸',
                    icon: 'mc-xiugailashen',
                    action: 'STRETCH',
                    detailToolTip: [
                      { text: '通过窗选或多边形框选的方式拉伸对象', isDelay: false },
                      { text: '将拉伸窗交窗口部分包围的对象。将移动(而不是拉伸)完全包含在窗交窗口中的对象或单独选定的对象。某些对象类型(例如圆、椭圆和块)无法拉伸。' },
                      { imgUrl: '/toolTipImgs/modify/stretching.png' },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  },
                  {
                    label: '',
                    key: 'join',
                    value: '',
                    iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                    icon: 'mc-xiugaihebing',
                    desc: ' 合并',
                    type: window.MCEDITOR.TopMenuType.ICON,
                    action: '',
                    disabled: true,
                    detailToolTip: [
                      { text: '合并相似对象以形成一个完整的对象', isDelay: false },
                      { text: '在其公共端点处合并一系列有限的线性和开放的弯曲对象，以创建单个二维或三维对象。产生的对象类型取决于选定的对象类型、首先选定的对象类型以及对象是否共面。' },
                      { imgUrl: '/toolTipImgs/modify/join.png' },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  },
                ],
              ],
              [
                {
                  label: '旋转',
                  key: 'rotate',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-xiugaixuanzhuan',
                  desc: '旋转',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'ROTATE',
                  detailToolTip: [
                    { text: '绕基点旋转对象', isDelay: false },
                    { text: '可以围绕基点将选定的对象旋转到一个绝对的角度。' },
                    { imgUrl: '/toolTipImgs/modify/rotate.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '删除',
                  key: 'delete',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-xiugaishanchu',
                  desc: '删除',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  needCore: true,
                  action: 'ERASE',
                  detailToolTip: [
                    { text: '从图形删除对象', isDelay: false },
                    { text: '从图形中选对象，可以多选或者单选，然后按 DELETE 键,可以删除选定的对象。' },
                    { imgUrl: '/toolTipImgs/modify/delete.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                [
                  {
                    label: '',
                    key: 'explode',
                    value: '',
                    iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                    icon: 'mc-xiugaifenjie',
                    desc: ' 分解',
                    type: window.MCEDITOR.TopMenuType.ICON,
                    action: 'EXPLODE',
                    detailToolTip: [
                      { text: '将复合对象分解为其部件对象', isDelay: false },
                      { text: '在希望单独修改复合对象的部件时，可分解复合对象。可以分解的对象包括块、多段线及面域等。' },
                      { imgUrl: '/toolTipImgs/modify/explode.png' },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  },
                  {
                    label: '',
                    key: 'elongate',
                    iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                    value: '',
                    type: window.MCEDITOR.TopMenuType.ICON,
                    desc: ' 拉长',
                    icon: 'mc-xiugailachang',
                    action: '',
                    disabled: true,
                    detailToolTip: [
                      { text: '修改对象的长度和圆弧的包含角', isDelay: false },
                      { text: '可以将更改指定为百分比、增量或最终长度或角度。' },
                      { imgUrl: '/toolTipImgs/modify/elongate.png' },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  },
                ],
              ],
              [
                {
                  label: '缩放',
                  key: 'scale',
                  value: '',
                  icon: 'mc-xiugaisuofang',
                  desc: '缩放',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'SCALE',
                  detailToolTip: [
                    { text: '放大或缩小选定对象，缩放后保持对象的比例不变', isDelay: false },
                    { text: '要缩放对象，请指定基点和比例因子。基点将作为缩放操作的中心，并保持静止。比例因子大于1时将放大对象，比例因子介于0 和 1之间时将缩小对象。' },
                    { imgUrl: '/toolTipImgs/modify/scale.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '镜像',
                  key: 'mirror',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-xiugaijingxiang',
                  desc: '镜像',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'MIRROR',
                  detailToolTip: [
                    { text: '创建选定对象的镜像副本', isDelay: false },
                    { text: '可以创建表示半个图形的对象，选择这些对象并沿指定的线进行镜像以创建另一半。' },
                    { imgUrl: '/toolTipImgs/modify/mirror.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                [
                  {
                    label: '',
                    key: 'extend',
                    icon: 'mc-xiugaiyanshen',
                    iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                    value: '',
                    type: window.MCEDITOR.TopMenuType.ICON,
                    desc: ' 延伸',
                    action: '',
                    disabled: true,
                    detailToolTip: [
                      { text: '延伸对象以适合其他对象的边', isDelay: false },
                      { text: '要延伸对象，请首先选择边界，然后按 Enter键并选择要延伸的对象。要将所有对象用作边界，请在首次出现“选择对象“提示时按 Enter 键。' },
                      { imgUrl: '/toolTipImgs/modify/extend.png' },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  },
                  {
                    label: '',
                    key: 'break',
                    value: '',
                    iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                    icon: 'mc-xiugaidaduan',
                    desc: '打断',
                    type: window.MCEDITOR.TopMenuType.ICON,
                    action: '',
                    disabled: true,
                    detailToolTip: [
                      { text: '在两点之间打断选定的对象', isDelay: false },
                      { text: '可以在对象上的两个指走点之间创建间隔，从而将对象打断为两个对象。如果这些点不在对象上，则会自动投影到该对象上。break 通常用于为块或文字创建空间。' },
                      { imgUrl: '/toolTipImgs/modify/break.png' },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  },
                ],
              ],
              [
                {
                  label: '圆角',
                  key: 'fillet',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-xiugaiyuanjiao',
                  desc: ' 圆角',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'FILLET',
                  detailToolTip: [
                    { text: '给对象加圆角', isDelay: false },
                    { text: '在此示例中，创建的圆弧与选定的两条直线均相切。直线被修剪到圆弧的两端。要创建一个锐角转角，请输入零作为半径。' },
                    { imgUrl: '/toolTipImgs/modify/fillet.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '倒角',
                  value: '',
                  desc: '倒角',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  key: 'invertedAngle',
                  icon: 'mc-xiugaidaojiao',
                  action: 'CHAMFER',
                  detailToolTip: [
                    { text: '给对象加倒角', isDelay: false },
                    { text: '将按用户选择对象的次序应用指定的距离和角度。' },
                    { imgUrl: '/toolTipImgs/modify/invertedAngle.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                [
                  {
                    label: '',
                    key: 'breakPoint',
                    value: '',
                    iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                    icon: 'mc-xiugaidaduan',
                    desc: '打断于点',
                    type: window.MCEDITOR.TopMenuType.ICON,
                    action: '',
                    disabled: true,
                    detailToolTip: [
                      { text: '在一点打断选定的对象', isDelay: false },
                      { text: '有效对象包括直线、开放的多段线和圆弧。不能在一点打断闭合对象（例如圆）。' },
                      { imgUrl: '/toolTipImgs/modify/break.png' },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  },
                  {
                    label: '',
                    key: 'smooth',
                    value: '',
                    iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                    icon: 'mc-xiugaiguangshunquxian',
                    desc: '光顺曲线',
                    type: window.MCEDITOR.TopMenuType.ICON,
                    action: '',
                    disabled: true,
                    detailToolTip: [
                      { text: '在两条开放曲线的端点之间创建相切或平滑的样条曲线', isDelay: false },
                      { text: '选择端点附近的每个对象。生成的样条曲线的形状取决于指定的连续性。选定对象的长度保持不变。' },
                      { imgUrl: '/toolTipImgs/modify/smooth.png' },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  },
                ],
              ],
              [
                {
                  label: '修剪',
                  key: 'trim',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-xiugaicaijian',
                  desc: ' 修剪',
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  disabled: true,
                  action: '',
                  detailToolTip: [
                    { text: '修剪对象以适合其他对象的边', isDelay: false },
                    { text: '要修剪对象，请选择边界。然后按 Enter 键并选择要修剪的对象。要将所有对象用作边界，请在首次出现“选择对象"提示时按Enter 键。' },
                    { imgUrl: '/toolTipImgs/modify/trim.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
                {
                  label: '阵列',
                  key: 'array',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-xiugaizhenlie',
                  desc: ' 阵列',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: '',
                  disabled: true,
                  detailToolTip: [
                    { text: '按任意行、列和层级组合分布对象副本。', isDelay: false },
                    { text: '创建选定对象的副本的行和列阵列。' },
                    { imgUrl: '/toolTipImgs/modify/array.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                [
                  {
                    label: '',
                    key: 'offset',
                    value: '',
                    iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                    icon: 'mc-xiugaipianyi',
                    desc: ' 偏移',
                    type: window.MCEDITOR.TopMenuType.ICON,
                    action: '',
                    disabled: true,
                    detailToolTip: [
                      { text: '创建同心圆、平行线和等距曲线', isDelay: false },
                      { text: '可以在指定距离或通过一个点偏移对象。偏移对象后，可以使用修剪和延伸这种有效的方式来创建包含多条平行线和曲线的图形。' },
                      { imgUrl: '/toolTipImgs/modify/offset.png' },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  },
                  {
                    label: '',
                    key: 'Preceding',
                    icon: 'mc-xiugaiqianzhi',
                    desc: '前置',
                    iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                    value: window.MCCORE.McDrawOrderType.Top,
                    type: window.MCEDITOR.TopMenuType.DROPDOWN,
                    action: 'DRAWORDER',
                    detailToolTip: [
                      { text: '强制使选定对象显示在所有对象之前', isDelay: false },
                      { imgUrl: '/toolTipImgs/modify/Preceding.png' },
                    ],
                    activeMenuKey: ['Preceding'],
                    menuOptions: [
                      {
                        label: '',
                        key: 'Preceding',
                        icon: 'mc-xiugaiqianzhi',
                        desc: '前置',
                        value: window.MCCORE.McDrawOrderType.Top,
                        action: 'DRAWORDER',
                        detailToolTip: [
                          { text: '强制使选定对象显示在所有对象之前', isDelay: false },
                          { imgUrl: '/toolTipImgs/modify/Preceding.png' },
                        ],
                      }, {
                        label: '',
                        key: 'reaMounted',
                        desc: '后置',
                        value: window.MCCORE.McDrawOrderType.Bottom,
                        icon: 'mc-xiugaihouzhi',
                        action: 'DRAWORDER',
                        detailToolTip: [
                          { text: '强制使选定对象显示在所有对象之后', isDelay: false },
                          // { text: '使用 DRAWORDERCTL系统变量控制重叠对象的默认显示行为。此外，TEXTTOFRONT 命令将图形中的所有文字、标注或引线置于其他对象的前面，而 HATCHTOBACK 命令将所有图案填充对象置于其他对象的后面。' },
                          { imgUrl: '/toolTipImgs/modify/reaMounted.png' },
                        ],
                      },
                      {
                        label: '',
                        key: 'aboveTheObject',
                        desc: '置于对象之上',
                        value: window.MCCORE.McDrawOrderType.Up,
                        icon: 'mc-xiugaiduixiangzhishang',
                        action: 'DRAWORDER',
                        detailToolTip: [
                          { text: '强制使选定对象显示在指定的参照对象之前', isDelay: false },
                          { imgUrl: '/toolTipImgs/modify/aboveTheObject.png' },
                        ],
                      },
                      {
                        label: '',
                        key: 'underTheObject',
                        desc: '置于对象之下',
                        value: window.MCCORE.McDrawOrderType.Down,
                        icon: 'mc-xiugaiduixiangzhixia',
                        action: 'DRAWORDER',
                        detailToolTip: [
                          { text: '强制使选定对象显示在指定的参照对象之后', isDelay: false },
                          { imgUrl: '/toolTipImgs/modify/underTheObject.png' },
                        ],
                      },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                  },
                ],
              ],
            ],
          ],
        },
        {
          label: '注释',
          key: 'annotation',
          icon: 'mc-wenziyanse',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              [
                {
                  label: '文字',
                  key: 'lineText',
                  value: '',
                  icon: 'mc-zhushidanhangwenzi',
                  desc: '单行文字',
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  action: 'TEXT',
                  activeMenuKey: ['lineText'],
                  detailToolTip: [
                    { text: '将选定对象的图层更改为与目标图层相匹配', isDelay: false },
                    { imgUrl: '/toolTipImgs/annotation/lineText.png' },
                  ],
                  menuOptions: [
                    {
                      label: '文字',
                      desc: '单行文字',
                      key: 'lineText',
                      isChangeLabel: true,
                      icon: 'mc-zhushidanhangwenzi',
                      action: 'TEXT',
                      detailToolTip: [
                        { text: '输入文字的同时在屏幕上显示', isDelay: false },
                        { text: '可以使用单行文字创建一行或多行文字，其中，每行文字都是独立的对象，可对其进行移动、格式设置或其他修改。在文本框中单击鼠标右键可选择快捷菜单上的选项。' },
                        { imgUrl: '/toolTipImgs/annotation/lineText.png' },
                      ],
                    },
                    {
                      label: '文字',
                      desc: '多行文字',
                      key: 'multiLineText',
                      isChangeLabel: true,
                      icon: 'mc-zhushiduohangwenzi',
                      action: 'MTEXT',
                      detailToolTip: [
                        { text: '创建多行文字对象', isDelay: false },
                        { text: '可以将若干文字段落创建为单个多行文字对象。使用内置编辑器，可以格式化文字外观、列和边界。' },
                        { imgUrl: '/toolTipImgs/annotation/multiLineText.png' },
                      ],
                    },
                  ],
                  iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
                {
                  label: '标注',
                  key: 'lineFeature',
                  value: '',
                  icon: 'mc-zhushixianxingbiaozhu',
                  desc: '线性标注',
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  activeMenuKey: ['lineFeature'],
                  detailToolTip: [
                    { text: '创建线性标注', isDelay: false },
                    { text: '使用水平、竖直或旋转的尺寸线创建线性标注。' },
                    { imgUrl: '/toolTipImgs/annotation/lineFeature.png' },
                  ],
                  action: 'DIMLINEAR',
                  menuOptions: [
                    {
                      label: '线性',
                      desc: '线性标注',
                      key: 'lineFeature',
                      icon: 'mc-zhushixianxingbiaozhu',
                      action: 'DIMLINEAR',
                      detailToolTip: [
                        { text: '创建线性标注', isDelay: false },
                        { text: '使用水平、竖直或旋转的尺寸线创建线性标注。' },
                        { imgUrl: '/toolTipImgs/annotation/lineFeature.png' },
                      ],
                    },
                    {
                      label: '对齐',
                      key: 'align',
                      desc: '对齐',
                      icon: 'mc-zhushiduiqixianxingbiaozhu',
                      action: 'DIMALIGNED',
                      detailToolTip: [
                        { text: '创建对齐线性标注', isDelay: false },
                        { text: '创建与尺寸界线的原点对齐的线性标注。' },
                        { imgUrl: '/toolTipImgs/annotation/align.png' },
                      ],
                    },
                    {
                      label: '弧长',
                      key: 'arcLength',
                      desc: '弧长',
                      icon: 'mc-zhushihuchangbiaozhu',
                      action: 'DIMARC',
                      detailToolTip: [
                        { text: '创建弧长标注', isDelay: false },
                        { text: '弧长标注用于测量圆弧或多段线圆弧上的距离。弧长标注的尺寸界线可以正交或径向。在标注文字的上方或前面将显示圆弧符号' },
                        { imgUrl: '/toolTipImgs/annotation/arcLength.png' },
                      ],
                    },
                    {
                      label: '坐标',
                      key: 'position',
                      desc: '坐标',
                      icon: 'mc-zhushizuobiaobiaozhu',
                      action: 'DIMORDINATE',
                      detailToolTip: [
                        { text: '创建坐标标注', isDelay: false },
                        { text: '坐标标注用于测量从原点(称为基准)到要素(例如部件上的一个孔)的水平或垂直距离。这些标注通过保持特征与基准点之间的精确偏移量，来避免误差增大。' },
                        { imgUrl: '/toolTipImgs/annotation/position.png' },
                      ],
                    },
                    {
                      label: '半径',
                      key: 'radius',
                      desc: '半径',
                      icon: 'mc-zhushibanjingbiaozhu',
                      action: 'DIMRADIUS',
                      detailToolTip: [
                        { text: '创建圆或圆弧的半径标注', isDelay: false },
                        { text: '测量选定圆或圆弧的半径，并显示前面带有半径符号的标注文字。可以使用夹点轻松地重新定位生成的半径标注。' },
                        { imgUrl: '/toolTipImgs/annotation/radius.png' },
                      ],
                    },
                    {
                      label: '折弯',
                      key: 'bending',
                      icon: 'mc-zhushizhewanbiaozhu',
                      action: 'DIMJOGGED',
                      desc: '折弯',
                      detailToolTip: [
                        { text: '创建圆和圆弧的折弯标注', isDelay: false },
                        { text: '当圆弧或圆的中心位于布局之外并且无法在其实际位置显示时将创建折弯半径标注。可以在更方便的位置指定标注的原点(这称为中心位置替代)。' },
                        { imgUrl: '/toolTipImgs/annotation/bending.png' },
                      ],
                    },
                    {
                      label: '直径',
                      key: 'diameter',
                      desc: '直径',
                      icon: 'mc-zhushizhijingbiaozhu',
                      action: 'DIMDIAMETER',
                      detailToolTip: [
                        { text: '创建圆或圆弧的直径标注', isDelay: false },
                        { text: '测量选定圆或圆弧的直径，并显示前面带有直径符号的标注文字。可以使用夹点轻松地重新定位生成的直径标注。' },
                        { imgUrl: '/toolTipImgs/annotation/diameter.png' },
                      ],
                    },
                    {
                      label: '角度',
                      key: 'angle',
                      desc: '角度',
                      icon: 'mc-zhushibiaojiaoduzhu',
                      action: 'DIMANGULAR',
                      detailToolTip: [
                        { text: '创建角度标注', isDelay: false },
                        { text: '测量选定的对象或 3个点之间的角度。可以选择的对象包括圆弧、圆和直线等。' },
                        { imgUrl: '/toolTipImgs/annotation/angle.png' },
                      ],
                    },
                  ],
                  iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
                {
                  label: '表格',
                  key: 'table',
                  value: '',
                  icon: 'mc-biaodanzujian-biaoge',
                  desc: '',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'TABLE',
                  iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
              [
                {
                  label: '',
                  key: 'textStyleManager',
                  value: '',
                  icon: 'mc-zhushiwenziyangshi',
                  iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                  desc: '文字样式',
                  type: window.MCEDITOR.TopMenuType.ICON,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  needCore: true,
                  actionFun: (core) => {
                    window.MCEDITOR.topToolUtils.openTextStyleManagerMenu(core);
                  },
                },
                {
                  label: '',
                  key: 'labelStyleManager',
                  value: '',
                  icon: 'mc-zhushibiaozhuyangshi',
                  iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                  desc: '标注样式',
                  type: window.MCEDITOR.TopMenuType.ICON,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  needCore: true,
                  actionFun: (core) => {
                    window.MCEDITOR.topToolUtils.openAnnotationStyleManagerMenu(core);
                  },
                },
                {
                  label: '表格',
                  key: 'annotationTable',
                  value: '',
                  icon: 'mc-zhushibiaogeyangshi',
                  iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                  desc: '表格',
                  type: window.MCEDITOR.TopMenuType.ICON,
                  action: 'TABLESTYLE',
                  detailToolTip: [
                    { text: '创建空的表格对象', isDelay: false },
                    { text: '表格是在行和列中包含数据的复合对象。可以通过空的表格或表格样式创建空的表格对象。还可以将表格链接至Microsoft Excel电子表格中的数据。' },
                    { imgUrl: '/toolTipImgs/annotation/annotationTable.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                },
              ],
              [
                {
                  label: '',
                  key: 'textStyle',
                  value: '',
                  desc: '文字样式',
                  type: window.MCEDITOR.TopMenuType.SELECT,
                  async selectAction(core) {
                    // 需要添加监听器
                    // 获取菜单文字类型db
                    const db = core.getDatabase();
                    const textTable = db.getTextStyleTable();
                    const textTableListener = textTable.getEventReactor();
                    const getMcCoreGetTextType = async () => {
                      const menuInfo = await window.MCEDITOR.mcCoreToolUtils.mcCoreGetTextType(core);
                      this.value = menuInfo.value;
                      this.disabled = menuInfo.disabled;
                      this.options = menuInfo.options;
                    };
                    const modifyCurrentValue = (val) => {
                      this.value = val;
                    };
                      // 清除上一的监听-tab频繁切换
                    textTableListener.off('recordAdded', getMcCoreGetTextType);
                    textTableListener.off('recordDeleted', getMcCoreGetTextType);
                    textTableListener.off('recordModified', getMcCoreGetTextType);
                    textTableListener.off('currentRecordChanged', modifyCurrentValue);
                    await getMcCoreGetTextType();
                    // 开启下一次的监听
                    textTableListener.on('recordAdded', getMcCoreGetTextType);
                    textTableListener.on('recordDeleted', getMcCoreGetTextType);
                    textTableListener.on('recordModified', getMcCoreGetTextType);
                    textTableListener.on('currentRecordChanged', modifyCurrentValue);
                  },
                  detailToolTip: [
                    { text: '创建、修改或指定文字样式', isDelay: false },
                    { text: '可以指定当前文字样式以确定所有新文字的外观。文字样式包含字体、字号、倾斜角度、方向和其他文字特征。' },
                    { imgUrl: '/toolTipImgs/annotation/textStyle.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '',
                  key: 'labelStyle',
                  value: '',
                  desc: '标注特性',
                  type: window.MCEDITOR.TopMenuType.SELECT,
                  async selectAction(core) {
                    const db = core.getDatabase();
                    const annotationTable = db.getDimStyleTable();
                    const annotationTableListener = annotationTable.getEventReactor();
                    const getMcCoreGetAnnotation = async () => {
                      const menuInfo = await window.MCEDITOR.mcCoreToolUtils.mcCoreGetAnnotation(core);
                      this.value = menuInfo.value;
                      this.disabled = menuInfo.disabled;
                      this.options = menuInfo.options;
                    };
                    const modifyCurrentValue = (val) => {
                      this.value = val;
                    };
                      // 清除上一的监听-tab频繁切换
                    annotationTableListener.off('recordAdded', getMcCoreGetAnnotation);
                    annotationTableListener.off('recordDeleted', getMcCoreGetAnnotation);
                    annotationTableListener.off('recordModified', getMcCoreGetAnnotation);
                    annotationTableListener.on('currentRecordChanged', modifyCurrentValue);
                    await getMcCoreGetAnnotation();
                    // 开启下一次的监听
                    annotationTableListener.on('recordAdded', getMcCoreGetAnnotation);
                    annotationTableListener.on('recordDeleted', getMcCoreGetAnnotation);
                    annotationTableListener.on('recordModified', getMcCoreGetAnnotation);
                    annotationTableListener.on('currentRecordChanged', modifyCurrentValue);
                  },
                  detailToolTip: [
                    { text: '创建和修改标注样式', isDelay: false },
                    { text: '标注样式是标注设置的命名集合，用于控制标注的外观。用户可以创建标注样式，以快速指定标注的格式，并确保标注符合标准。' },
                    { imgUrl: '/toolTipImgs/annotation/labelStyle.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '',
                  key: 'tableStyle',
                  value: '',
                  desc: '表格样式',
                  type: window.MCEDITOR.TopMenuType.SELECT,
                  async selectAction(core) {
                    const tableStyleDict = core.getDatabase().getTableStyleDict();
                    const tableStyleListener = tableStyleDict.getEventReactor();
                    const getMcCoreTableStyle = async () => {
                      const menuInfo = await window.MCEDITOR.mcCoreToolUtils.mcCoreGetTableStyle(core);
                      this.value = menuInfo.value;
                      this.disabled = menuInfo.disabled;
                      this.options = menuInfo.options;
                    };
                    const modifyCurrentValue = (value) => {
                      this.value = value;
                    };
                    // 页签切换会重复初始化菜单，先移除同一回调，避免样式变化时重复刷新。
                    tableStyleListener.off('dictionaryAdded', getMcCoreTableStyle);
                    tableStyleListener.off('dictionaryDeleted', getMcCoreTableStyle);
                    tableStyleListener.off('dictionaryModified', getMcCoreTableStyle);
                    tableStyleListener.off('currentDictionaryChanged', modifyCurrentValue);
                    await getMcCoreTableStyle();
                    tableStyleListener.on('dictionaryAdded', getMcCoreTableStyle);
                    tableStyleListener.on('dictionaryDeleted', getMcCoreTableStyle);
                    tableStyleListener.on('dictionaryModified', getMcCoreTableStyle);
                    tableStyleListener.on('currentDictionaryChanged', modifyCurrentValue);
                  },
                  detailToolTip: [
                    { text: '设置当前表格样式', isDelay: false },
                    { text: '表格样式用于控制表格及其单元格的外观。选择表格时可查看或切换所选表格的样式。' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
            ],
            [
              [
                {
                  label: '引线',
                  key: 'leadWire',
                  value: '',
                  icon: 'mc-zhushiyinxian',
                  desc: '引线',
                  activeMenuKey: ['leadWire'],
                  type: window.MCEDITOR.TopMenuType.DROPDOWN,
                  action: 'MLEADER',
                  detailToolTip: [
                    { text: '创建多重引线对象', isDelay: false },
                    { text: '多重引线对象通常包含箭头、水平基线、引线或曲线和多行文字对象或块。' },
                    { imgUrl: '/toolTipImgs/annotation/leadWire.png' },
                  ],
                  menuOptions: [
                    {
                      label: '引线',
                      key: 'leadWire',
                      desc: '引线',
                      icon: 'mc-zhushiyinxian',
                      action: 'MLEADER',
                      detailToolTip: [
                        { text: '创建多重引线对象', isDelay: false },
                        { text: '多重引线对象通常包含箭头、水平基线、引线或曲线和多行文字对象或块。' },
                        { imgUrl: '/toolTipImgs/annotation/leadWire.png' },
                      ],
                    },
                    {
                      label: '添加',
                      key: 'addLeadWire',
                      desc: '添加',
                      icon: 'mc-zhushitianjiayinxian',
                      action: 'MLEADERADD',
                      detailToolTip: [
                        { text: '将引线添加至现有的多重引线对象', isDelay: false },
                        { text: '将引线添加至选定的多重引线对象。根据光标的位置，新引线将添加到选定多重引线的左侧或右侧。' },
                        { imgUrl: '/toolTipImgs/annotation/addLeadWire.png' },
                      ],
                    },
                    {
                      label: '删除',
                      desc: '删除引线',
                      key: 'removeLeadWire',
                      icon: 'mc-zhushishanchuyinxian',
                      action: 'MLEADERDELETE',
                      detailToolTip: [
                        { text: '将引线从现有的多重引线对象中删除', isDelay: false },
                        { imgUrl: '/toolTipImgs/annotation/removeLeadWire.png' },
                      ],
                    },
                    // {
                    //   label: '对齐',
                    //   key: 'alignLeadWire',
                    //   icon: 'mc-zhushiyinxianduiqi',
                    //   detailToolTip: [
                    //     { text: '将选定多重引线对象对齐并按一定间距排列', isDelay: false },
                    //     { text: '选择多重引线后，指定所有其他多重引线要与之对齐的多重引线。' },
                    //     { imgUrl: '/toolTipImgs/annotation/alignLeadWire.png' },
                    //   ],
                    //   action: '',
                    // },
                    // {
                    //   label: '合并',
                    //   key: 'mergeLeadWire',
                    //   icon: 'mc-zhushihebingyinxian',
                    //   detailToolTip: [
                    //     { text: '将包含块的选定多重引线组织到行或列中，并使用单引线显示结果', isDelay: false },
                    //     { imgUrl: '/toolTipImgs/annotation/mergeLeadWire.png' },
                    //   ],
                    //   action: '',
                    // },
                  ],
                  iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL_DROPDOWN,
                },
              ],
              [
                {
                  label: '',
                  key: 'multipleLeadWireStyleManager',
                  value: '',
                  icon: 'mc-zhushiduozhongyinxianyangshi',
                  iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                  desc: '引线样式',
                  type: window.MCEDITOR.TopMenuType.ICON,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  needCore: true,
                  actionFun: (core) => {
                    window.MCEDITOR.topToolUtils.openMultipleLeadStylesManagerMenu(core);
                  },
                }],
              [
                {
                  label: '',
                  key: 'multipleLeadWireStyle',
                  value: '',
                  desc: '引线样式',
                  type: window.MCEDITOR.TopMenuType.SELECT,
                  async selectAction(core) {
                    // 需要添加监听器
                    // 获取菜单文字类型db
                    const db = core.getDatabase();
                    const leaderStyle = db.getMLeaderStyleDict();
                    // 此处需要王振刚添加事件监听器（core实现）。
                    const leaderStyleListener = leaderStyle.getEventReactor();
                    const getMcCoreGetLeaderType = async () => {
                      const menuInfo = await window.MCEDITOR.mcCoreToolUtils.mcCoreGetLeaderType(core);
                      this.value = menuInfo.value;
                      this.disabled = menuInfo.disabled;
                      this.options = menuInfo.options;
                    };
                    const modifyCurrentValue = (val) => {
                      this.value = val;
                    };
                      // // 清除上一的监听-tab频繁切换
                    leaderStyleListener.off('dictionaryAdded', getMcCoreGetLeaderType);
                    leaderStyleListener.off('dictionaryDeleted', getMcCoreGetLeaderType);
                    leaderStyleListener.off('dictionaryModified', getMcCoreGetLeaderType);
                    leaderStyleListener.off('currentDictionaryChanged', modifyCurrentValue);
                    await getMcCoreGetLeaderType();
                    // 开启下一次的监听
                    leaderStyleListener.on('dictionaryAdded', getMcCoreGetLeaderType);
                    leaderStyleListener.on('dictionaryDeleted', getMcCoreGetLeaderType);
                    leaderStyleListener.on('dictionaryModified', getMcCoreGetLeaderType);
                    leaderStyleListener.on('currentDictionaryChanged', modifyCurrentValue);
                  },
                  detailToolTip: [
                    { text: '创建和修改多重引线样式', isDelay: false },
                    { text: '多重引线样式可以控制多重引线外观。这些样式可指定基线、引线、箭头和内容的格式。' },
                    { imgUrl: '/toolTipImgs/annotation/multipleLeadWireStyle.png' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                }],
            ],
          ],
        },
        {
          label: '图层',
          key: 'layer',
          icon: 'mc-tucengtexing',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              {
                label: '图层\n特性',
                key: 'layerFeature',
                value: '',
                icon: 'mc-tucengtexing',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                desc: '图层特性',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                action: 'LAYER',
                detailToolTip: [
                  { text: '管理图层和图层特性', isDelay: false },
                  { imgUrl: '/toolTipImgs/layer/layerFeature.png' },
                ],
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
              },
              [
                {
                  label: '',
                  key: 'layerSelect',
                  value: '',
                  desc: '图层',
                  component: 'LayerSelect',
                  type: window.MCEDITOR.TopMenuType.SELECT,
                  action: '',
                  async selectAction(core) {
                    const layerTableReactor = core.getDatabase().getLayerTable().getEventReactor();
                    const getLayerInfos = async () => {
                      const layerData = await window.MCEDITOR.mcCoreToolUtils.mcCoreGetLayer(core);
                      this.value = layerData.value;
                      this.disabled = layerData.disabled;
                      this.options = layerData.options;
                    };
                    const modifyCurrentValue = (val) => {
                      this.value = val;
                    };
                    // 清除上一的监听-tab频繁切换
                    layerTableReactor.off('recordAdded', getLayerInfos);
                    layerTableReactor.off('recordDeleted', getLayerInfos);
                    layerTableReactor.off('recordModified', getLayerInfos);
                    layerTableReactor.off('currentRecordChanged', modifyCurrentValue);
                    await getLayerInfos();
                    // 开启下一次的监听
                    layerTableReactor.on('recordAdded', getLayerInfos);
                    layerTableReactor.on('recordDeleted', getLayerInfos);
                    layerTableReactor.on('recordModified', getLayerInfos);
                    layerTableReactor.on('currentRecordChanged', modifyCurrentValue);
                  },
                  detailToolTip: [
                    { text: '用于选择图形中定义的图层和图层设置，以便将其置为当前', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                [
                  [
                    {
                      label: '',
                      key: 'closeLayer',
                      value: true,
                      iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                      icon: 'mc-new_tucengguan',
                      desc: '关闭',
                      type: window.MCEDITOR.TopMenuType.ICON,
                      actionFun: (core) => {
                        window.MCEDITOR.topModuleToolUtils.setObjectLayer(core, 'setIsOff', '关闭', true);
                      },
                      detailToolTip: [
                        { text: '关闭选定对象的图层', isDelay: false },
                        { text: '关闭选定对象的图层可使该对象不可见。如果在处理图形时需要不被遮挡的视图，或者如果不想打印细节（例如参考线），则此命令将很有用。' },
                      ],
                      displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                    },
                    {
                      label: '',
                      key: 'openLayer',
                      value: false,
                      iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                      icon: 'mc-new_tucengkai',
                      desc: '打开所有图层',
                      type: window.MCEDITOR.TopMenuType.ICON,
                      actionFun: (core) => {
                        const layers = core.getDatabase().getLayerTable().getList();
                        for (let i = 0; i < layers.length; i++) {
                          window.MCCORE.execCommand('MCCORESETLAYER', core, layers[i], 'setIsOff', false);
                        }
                      },
                      detailToolTip: [
                        { text: '打开图形中的所有图层', isDelay: false },
                        { text: '之前关闭的所有图层均将重新打开。' },
                      ],
                      displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                    },
                  ],
                  [
                    {
                      label: '',
                      key: 'layerIso',
                      value: true,
                      iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                      icon: 'mc-new_geli',
                      desc: '隔离',
                      type: window.MCEDITOR.TopMenuType.ICON,
                      action: 'LAYISO',
                      detailToolTip: [
                        { text: '隐藏或冻结除选定对象的图层之外的所有图层', isDelay: false },
                        { text: '根据当前设置，除选定对象所在图层之外的所有图层均将关闭、在当前布局视口中冻结或锁定。保持可见且未锁定的图层称为隔离。' },
                      ],
                      displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                    },
                    {
                      label: '',
                      key: 'layerIsoOff',
                      value: false,
                      iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                      icon: 'mc-new_quxiaogeli',
                      desc: '取消隔离',
                      type: window.MCEDITOR.TopMenuType.ICON,
                      action: 'LAYISO',
                      detailToolTip: [
                        { text: '显示或解锁除选定对象的图层之外的所有图层', isDelay: false },
                        { text: '根据当前设置，除选定对象所在图层之外的所有图层均将显示、解冻或解锁。' },
                      ],
                      displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                    },
                  ],
                  [
                    {
                      label: '',
                      key: 'frozenLayer',
                      value: true,
                      iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                      icon: 'mc-new_tucengdongjie',
                      desc: '冻结',
                      type: window.MCEDITOR.TopMenuType.ICON,
                      actionFun: (core) => {
                        window.MCEDITOR.topModuleToolUtils.setObjectLayer(core, 'setIsFrozen', '冻结', true);
                      },
                      detailToolTip: [
                        { text: '冻结选定对象的图层', isDelay: false },
                        { text: '冻结图层上的对象不可见。在大型图形中，冻结不需要的图层将加快显示和重生成的操作速度。' },
                      ],
                      displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                    },
                    {
                      label: '',
                      key: 'unfrozenLayer',
                      value: false,
                      iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                      icon: 'mc-new_tucengdongjieguan',
                      desc: '解冻所有图层',
                      type: window.MCEDITOR.TopMenuType.ICON,
                      actionFun: (core) => {
                        const layers = core.getDatabase().getLayerTable().getList();
                        for (let i = 0; i < layers.length; i++) {
                          window.MCCORE.execCommand('MCCORESETLAYER', core, layers[i], 'setIsFrozen', false);
                        }
                      },
                      detailToolTip: [
                        { text: '解冻图形中的所有图层', isDelay: false },
                        { text: '之前所有冻结的图层都将解冻。' },
                      ],
                      displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                    },
                  ],
                  [
                    {
                      label: '',
                      key: 'lockLayer',
                      value: true,
                      iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                      icon: 'mc-new_tucengsuoding',
                      desc: '锁定',
                      type: window.MCEDITOR.TopMenuType.ICON,
                      actionFun: (core) => {
                        window.MCEDITOR.topModuleToolUtils.setObjectLayer(core, 'setIsLocked', '锁定', true);
                      },
                      detailToolTip: [
                        { text: '锁定选定对象的图层', isDelay: false },
                        { text: '使用此命令，可以防止意外修改图层上的对象。' },
                      ],
                      displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                    },
                    {
                      label: '',
                      key: 'unlockLayer',
                      value: false,
                      iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                      icon: 'mc-new_tucengjiesuo',
                      desc: '解锁图层',
                      type: window.MCEDITOR.TopMenuType.ICON,
                      actionFun: (core) => {
                        window.MCEDITOR.topModuleToolUtils.setObjectLayer(core, 'setIsLocked', '解锁', false);
                      },
                      detailToolTip: [
                        { text: '解锁选定对象的图层', isDelay: false },
                        { text: '可以选择锁定图层上的对象并解锁该图层，而无需指定该图层的名称。' },
                      ],
                      displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                    },
                  ],
                  [
                    {
                      label: '置为当前',
                      key: 'currentLayer',
                      value: '',
                      iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                      icon: 'mc-new_zhiweidangqiantuceng',
                      desc: '置为当前',
                      type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                      needCore: true,
                      action: 'SETLAYERCURRENT',
                      actionFun(core) {
                        window.MCCORE.execCommand('SETLAYERCURRENT', core);
                      },
                      detailToolTip: [
                        { text: '将当前图层设置为选定对象所在的图层', isDelay: false },
                        { text: '可以通过选择当前图层上的对象来更改该图层。' },
                        { imgUrl: '/toolTipImgs/layer/currentLayer.png' },
                      ],
                      displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                    },
                    {
                      label: '匹配图层',
                      key: 'layerMatch',
                      value: false,
                      iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                      icon: 'mc-new_tucengpipei',
                      desc: '匹配图层',
                      type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                      needCore: true,
                      action: 'LAYMCH',
                      detailToolTip: [
                        { text: '将选定对象的图层更改为与目标图层相匹配', isDelay: false },
                        { text: '如果在错误的图层上创建了对象，可以通过选择目标图层上的对象来更改该对象的图层。' },
                        { imgUrl: '/toolTipImgs/layer/layerMatch.png' },
                      ],
                      displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                    },
                  ],
                ],
              ],
            ],
          ],
        },
        {
          label: '特性',
          key: 'featureStyle',
          icon: 'mc-texingpipei',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              {
                label: '特性\n匹配',
                key: 'featureMatch',
                value: '',
                icon: 'mc-texingpipei',
                iconSize: window.MCEDITOR.TopMenuIconSize.LARGE,
                desc: '特性匹配',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                action: 'MATCHPROP',
                detailToolTip: [
                  { text: '将选定对象的特性应用到其他对象', isDelay: false },
                  { text: '可应用的特性类型包含颜色、图层、线型、线型比例、线宽、打印样式、透明度和其他指定的特性。' },
                ],
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
              },
              {
                label: '特性\n面板',
                key: 'featurePanel',
                value: '',
                icon: 'mc-xianshitexing',
                iconSize: window.MCEDITOR.TopMenuIconSize.LARGE,
                desc: '特性面板',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                action: 'PROPERTIES',
                detailToolTip: [
                  { text: '将选定对象的特性展示', isDelay: false },
                ],
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
              }, [
                {
                  label: '颜色',
                  key: 'ColorSelectFeature',
                  value: '',
                  icon: 'mc-texingyanse',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  desc: '对象颜色',
                  type: window.MCEDITOR.TopMenuType.SELECT,
                  component: 'ColorSelect',
                  action: 'MCCORESETCOLOR',
                  async selectAction(core) {
                    const colorData = await window.MCEDITOR.mcCoreToolUtils.mcCoreGetColor(core);
                    this.value = colorData.value;
                    this.disabled = colorData.disabled;
                  },
                  detailToolTip: [
                    { text: '用于选择要置为当前的颜色(如果未选定任何对象)，或更改选定对象的颜色', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '线宽',
                  key: 'lineWidthSelectFeature',
                  value: '',
                  icon: 'mc-texingxiankuan',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  desc: '线宽',
                  component: 'LineWeightSelect',
                  type: window.MCEDITOR.TopMenuType.SELECT,
                  action: 'MCCORESETLINEWIDTH',
                  async selectAction(core) {
                    const colorData = await window.MCEDITOR.mcCoreToolUtils.mcCoreGetLineWidth(core);
                    this.value = colorData.value;
                    this.disabled = colorData.disabled;
                  },
                  detailToolTip: [
                    { text: '用于选择要置为当前的线宽(如果未选定任何对象)，或更改选定对象的线宽', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '线型',
                  key: 'lineTypeSelectFeature',
                  value: '',
                  icon: 'mc-texingxianxing',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  desc: '线型',
                  component: 'LineTypeSelect',
                  type: window.MCEDITOR.TopMenuType.SELECT,
                  action: 'MCCORESETLINETYPE',
                  async selectAction(core) {
                    const colorData = await window.MCEDITOR.mcCoreToolUtils.mcCoreGetLineType(core);
                    this.value = colorData.value;
                    this.disabled = colorData.disabled;
                  },
                  detailToolTip: [
                    { text: '用于选择要置为当前的线型(如果未选定任何对象)，或更改选定对象的线型', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
            ],
          ],
        },
        {
          label: '块',
          key: 'blockStyle',
          icon: 'mc-kuai',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              {
                label: '插入',
                key: 'block',
                value: '',
                iconSize: window.MCEDITOR.TopMenuIconSize.LARGE,
                icon: 'mc-kuai',
                desc: '插入块',
                type: window.MCEDITOR.TopMenuType.DROPDOWN,
                menuOptions: [
                  {
                    label: '常用插入块',
                    key: 'blockUsual',
                    component: 'McUiBlockUsualPanel', // 自定义组件
                  },
                ],
                detailToolTip: [
                  { text: '将块或图形插入到当前图形中', isDelay: false },
                  { text: '建议插入块库中的块。块库可以是存储相关块定义的图形文件，也可以是包含相关图形文件的文件，每个文件均可作为块插入。无论使用何种方法，块均可标准化且可供多个用户访问。' },
                ],
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL_DROPDOWN,
              },
              [
                {
                  label: '创建',
                  key: 'blockCreate',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-kuaixinjian',
                  desc: '创建',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'BLOCK',
                  detailToolTip: [
                    { text: '从选定对象创建块定义', isDelay: false },
                    { text: '通过选择对象、指定插入点然后为其命名，可创建块定义' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '编辑',
                  key: 'blockEdit',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-kuaibianji',
                  desc: '块编辑器',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'BEDIT',
                  detailToolTip: [
                    { text: '在块编辑器中打开块定义', isDelay: false },
                    { text: '块编辑器是一个独立的环境，用于为当前图形创建和更改块定义。还可以使用块编辑器向块中添加动态行为。' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '属性',
                  key: 'mc-kuaishuxing',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-kuaishuxing',
                  desc: '单个',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'ATTEDIT',
                  detailToolTip: [
                    { text: '编辑块参照中的属性', isDelay: false },
                    { text: '编辑块中每个属性的值、文字选项和特性。' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
            ],
          ],
        },
        {
          label: '符号库',
          key: 'symbolLib',
          icon: 'mc-fuhaoku',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              {
                label: '符号库',
                key: 'symbolLibKey',
                value: '',
                icon: 'mc-fuhaoku',
                iconSize: window.MCEDITOR.TopMenuIconSize.LARGE,
                desc: '符号库',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                action: 'OPENSYMBOLLIBPANEL',
                detailToolTip: [
                  { text: '符号的集中管理面板', isDelay: false },
                ],
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
              },
            ],
          ],
        },
        {
          label: '组',
          key: 'groupStyle',
          icon: 'mc-zuchuangjian',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              [
                {
                  label: '创建',
                  key: 'createGroup',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.LARGE,
                  icon: 'mc-zuchuangjian',
                  desc: '组创建',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'GROUP',
                  detailToolTip: [
                    { text: '创建对象组', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                },
                [
                  {
                    label: '',
                    key: 'enableGroupBox',
                    value: false,
                    icon: 'mc-zubiankuang',
                    desc: '边框',
                    type: window.MCEDITOR.TopMenuType.ICON,
                    iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                    active: window.MCCORE.mcSysValManger.getSysVal('enableGroupBox'),
                    action: '',
                    actionFun() {
                      this.active = !this.active;
                      window.MCCORE.mcSysValManger.setSysVal('enableGroupBox', this.active);
                      window.MCCORE.mcSysValManger.on('sysValChanged', (key) => {
                        if (key === 'enableGroupBox') {
                          const val = window.MCCORE.mcSysValManger.getSysVal('enableGroupBox');
                          if (val !== this.active)
                            this.active = val;
                        }
                      });
                    },
                    detailToolTip: [
                      { text: '启用和禁用组边界框', isDelay: false },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  },
                  {
                    label: '',
                    key: 'enableGroupSelect',
                    value: false,
                    icon: 'mc-zuxuanze',
                    desc: '组选择',
                    iconSize: window.MCEDITOR.TopMenuIconSize.DROPDOWN_ARROW,
                    type: window.MCEDITOR.TopMenuType.ICON,
                    active: window.MCCORE.mcSysValManger.getSysVal('enableGroupSelect'),
                    action: '',
                    actionFun() {
                      this.active = !this.active;
                      window.MCCORE.mcSysValManger.setSysVal('enableGroupSelect', this.active);
                      window.MCCORE.mcSysValManger.on('sysValChanged', (key) => {
                        if (key === 'enableGroupSelect') {
                          const val = window.MCCORE.mcSysValManger.getSysVal('enableGroupSelect');
                          if (val !== this.active)
                            this.active = val;
                        }
                      });
                    },
                    detailToolTip: [
                      { text: '启用和禁用组选择', isDelay: false },
                    ],
                    displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  },
                ],
              ],
              [
                {
                  label: '解组',
                  key: 'release',
                  value: '',
                  icon: 'mc-zujiechu',
                  desc: '解除编组',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  action: 'UNGROUP',
                  detailToolTip: [
                    { text: '将组分解或解组', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '编辑',
                  key: 'edit',
                  value: '',
                  icon: 'mc-zubianji',
                  desc: '组编辑',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  action: 'GROUPEDIT',
                  detailToolTip: [
                    { text: '将对象添加至组或从组中删除对象', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '管理',
                  key: 'manage',
                  value: '',
                  icon: 'mc-zuguanli',
                  desc: '组管理',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  disabled: true,
                  action: '',
                  detailToolTip: [
                    { text: '显示组对话框以管理命名组', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
            ],
          ],
        },
        {
          label: '工具',
          key: 'tools',
          icon: 'mc-celiangjuli',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              {
                label: '测量',
                key: 'distance',
                value: '',
                icon: 'mc-celiangjuli',
                desc: '测量工具',
                iconSize: window.MCEDITOR.TopMenuIconSize.LARGE,
                type: window.MCEDITOR.TopMenuType.DROPDOWN,
                activeMenuKey: ['distance'],
                action: 'DIST',
                menuOptions: [
                  {
                    label: '距离',
                    key: 'distance',
                    icon: 'mc-celiangjuli',
                    action: 'DIST',
                    detailToolTip: [
                      { text: '测量两点之间或多段线上的距离', isDelay: false },
                      { text: '在模型空间中，X、Y和Z组件距离和角度中的更改是在相对于当前的三维空间中测量的。' },
                      { text: '在图纸空间中，距离通常以二维图纸空间单位进行报告。但是在显示在单个视口中的模型空间中使用对象捕捉时，距离将报告为投影到与屏幕平行的平面上的二维模型空间距离。' },
                    ],
                  },
                  {
                    label: '',
                    key: 'height',
                    desc: '高度',
                    icon: 'mc-celianggaodu',
                    action: 'MEASUREHEIGHT',
                    detailToolTip: [
                      { text: '测量高度', isDelay: false },
                    ],
                  },
                  {
                    label: '',
                    key: 'radius',
                    desc: '半径',
                    icon: 'mc-celiangbanjing',
                    action: 'MEASURERADIUS',
                    detailToolTip: [
                      { text: '测量圆或圆弧的半径', isDelay: false },
                    ],
                  },
                  {
                    label: '',
                    key: 'area',
                    desc: '面积',
                    icon: 'mc-celiangmianji',
                    action: 'AREA',
                    detailToolTip: [
                      { text: '测量面积', isDelay: false },
                    ],
                  },
                  {
                    label: '',
                    key: 'volume',
                    desc: '体积',
                    icon: 'mc-celiangtiji',
                    action: 'VOLUME',
                    detailToolTip: [
                      { text: '测量体积', isDelay: false },
                    ],
                  },
                ],
                detailToolTip: [
                  { text: '测量两点之间或多段线上的距离', isDelay: false },
                  { text: '在模型空间中，X、Y和Z组件距离和角度中的更改是在相对于当前的三维空间中测量的。' },
                  { text: '在图纸空间中，距离通常以二维图纸空间单位进行报告。但是在显示在单个视口中的模型空间中使用对象捕捉时，距离将报告为投影到与屏幕平行的平面上的二维模型空间距离。' },
                ],
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL_DROPDOWN,
              },
              [
                {
                  label: '',
                  key: 'quickSelect',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-kuaisuxuanze',
                  desc: '快速选择',
                  needCore: true,
                  type: window.MCEDITOR.TopMenuType.ICON,
                  action: 'QSELECT',
                  detailToolTip: [
                    { text: '打开快速选择器面板', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '',
                  key: 'coordinateCorrect',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-zuobiaoxiaozheng',
                  desc: ' 坐标校正',
                  type: window.MCEDITOR.TopMenuType.ICON,
                  action: 'OPENCOORDINATECORRECTION',
                  detailToolTip: [
                    { text: '坐标校正', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '',
                  key: 'degree',
                  desc: '角度',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  type: window.MCEDITOR.TopMenuType.ICON,
                  icon: 'mc-celiangjiaodu',
                  action: 'MEASUREANGLE',
                  detailToolTip: [
                    { text: '测量角度', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
            ],
          ],
        },
        {
          label: '剪贴板',
          key: 'clipboard',
          icon: 'mc-niantie',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              {
                label: '粘贴',
                key: 'paste',
                value: '',
                iconSize: window.MCEDITOR.TopMenuIconSize.LARGE,
                icon: 'mc-niantie',
                desc: '粘贴 (Ctrl +V)',
                type: window.MCEDITOR.TopMenuType.DROPDOWN,
                action: 'PASTECLIP',
                activeMenuKey: ['paste'],
                detailToolTip: [
                  { text: '将剪贴板中的对象粘贴到当前图形中', isDelay: false },
                  { text: '将对象复制到剪贴板时，将以所有可用格式存储信息。将剪贴板的内容粘贴到图形中时，将使用保留信息最多的格式。还可以使用“复制"和“粘贴"在图形间传输对象。' },
                ],
                menuOptions: [
                  {
                    label: '粘贴  ',
                    key: 'paste',
                    desc: '粘贴 (Ctrl +V)',
                    icon: 'mc-niantie',
                    action: 'PASTECLIP',
                    detailToolTip: [
                      { text: '将剪贴板中的对象粘贴到当前图形中', isDelay: false },
                      { text: '将对象复制到剪贴板时，将以所有可用格式存储信息。将剪贴板的内容粘贴到图形中时，将使用保留信息最多的格式。还可以使用“复制"和“粘贴"在图形间传输对象。' },
                    ],
                  },
                  {
                    label: '粘贴为块',
                    key: 'pasteBlock',
                    desc: '粘贴为块(Ctrl+Shift+V)',
                    icon: 'mc-niantieweikuai',
                    action: 'PASTEBLOCK',
                    detailToolTip: [
                      { text: '将剪贴板中的对象作为块粘贴到当前图形中', isDelay: false },
                      { text: '将复制到剪贴板的对象作为块粘贴到图形中指定的插入点。将为块给定随机名称。' },
                    ],
                  },
                  {
                    label: '粘贴到原坐标',
                    key: 'pasteToOrigin',
                    desc: '粘贴到原坐标',
                    icon: 'mc-niantiedaoyuanzuobiao',
                    action: 'PASTEORIG',
                    detailToolTip: [
                      { text: '使用原坐标将剪贴板中的对象粘贴到当前图形中', isDelay: false },
                      { text: '复制到剪贴板的对象将被粘贴到当前图形中，其粘贴位置与原始图形中使用的坐标相同。仅当剪贴板包含来自除当前图形以外图形的 webCloud 数据时，此命令才有效。' },
                    ],
                  },
                ],
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL_DROPDOWN,
              },
              [
                {
                  label: '',
                  key: 'cut',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  value: '',
                  icon: 'mc-jianqie',
                  desc: '剪切(Ctrl+X)',
                  type: window.MCEDITOR.TopMenuType.ICON,
                  action: 'CUTCLIP',
                  detailToolTip: [
                    { text: '将选定对象复制到剪贴板并将其从图形中删除', isDelay: false },
                    { text: '如果要在其他应用程序中使用图形文件中的对象，可以先将这些对象剪切到剪贴板，然后将其粘贴到其他应用程序中。还可以使用“剪切"和“粘贴"在图形之间传输对象。' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '',
                  key: 'copy',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  value: '',
                  icon: 'mc-fuzhi',
                  desc: '复制剪裁(Ctrl+C)',
                  type: window.MCEDITOR.TopMenuType.ICON,
                  action: 'COPYCLIP',
                  detailToolTip: [
                    { text: '将选定对象复制到剪贴板', isDelay: false },
                    { text: '将对象复制到剪贴板时，将以所有可用格式存储信息。将剪贴板的内容粘贴到图形中时，将使用保留信息最多的格式。还可以使用“复制"和“粘贴"在图形间传输对象。' },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
                {
                  label: '',
                  key: 'copyWithBasePoint',
                  value: '',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-daijidianfuzhi',
                  desc: '带基点复制',
                  type: window.MCEDITOR.TopMenuType.ICON,
                  action: 'COPYBASE',
                  detailToolTip: [
                    { text: '将选定对象连着基点数据复制到剪贴板', isDelay: false },
                  ],
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                },
              ],
            ],
          ],
        },
      ],
    },
    {
      label: '采集工具',
      key: 'geologyCollectToolData',
      children: [
        {
          label: '巷道',
          key: 'tunnelModuleData',
          icon: 'mc-xiangdao',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              {
                label: '绘制巷道',
                key: 'DRAWTUNNEL',
                value: 'DRAWTUNNEL',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-xiangdao',
                desc: '绘制巷道',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'DRAWTUNNEL',
              },
              [
                {
                  label: '坐标矫正',
                  key: 'coordinateCorrectionKey',
                  value: '',
                  icon: 'mc-zuobiaoxiaozheng',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  desc: '坐标矫正',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENCOORDINATECORRECTION',
                },
                {
                  label: '巷道样式',
                  key: 'tunnelStyle',
                  value: 'tunnelStyle',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-duoduanxianzhuanxiangdao',
                  desc: '巷道样式',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENTUNNELSTYLEMANAGER',
                },
                {
                  label: '绘制立井',
                  key: 'drawWell',
                  value: 'drawWell',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-lijing',
                  desc: '绘制立井',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENTUNNELSHAFT',
                },
              ],
              [
                {
                  label: '合并',
                  key: 'merge',
                  value: 'merge',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-hebingxiangdao',
                  desc: '合并巷道',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'MERGETUNNEL',
                },
                {
                  label: '打断',
                  key: 'interrupt',
                  value: 'interrupt',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-daduanxiangdao',
                  desc: '打断巷道',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'BREAKTUNNEL',
                },
                {
                  label: '清空',
                  key: 'clear',
                  value: 'clear',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-qingkong',
                  desc: '清空巷道',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'CLEARTUNNELENTITIESCOMMAND',
                },
              ],
              [
                {
                  label: '批量编辑',
                  key: 'batch_edit',
                  value: 'batch_edit',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-piliangbianji',
                  desc: '批量编辑',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENBATCHEDITTUNNELS',
                },
                {
                  label: '多段线转换',
                  key: 'POLYLINETOTUNNEL',
                  value: 'POLYLINETOTUNNEL',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-duoduanxianzhuanxiangdao',
                  desc: '多段线转换',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'POLYLINETOTUNNEL',
                },
                {
                  label: '构建拓扑',
                  key: 'build_plugin',
                  value: 'build_plugin',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-goujiantuopu',
                  desc: '构建拓扑',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENBUILDTOPOLOGY',
                },
              ],
              [
                {
                  label: '拓扑检查',
                  key: 'copy_check',
                  value: 'copy_check',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-tuopujiancha',
                  desc: '拓扑检查',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENTOPOLOGYCHECK',
                },
                {
                  label: '巷道自检',
                  key: 'self_check',
                  value: 'self_check',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-xiangdaozijian',
                  desc: '巷道自检',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENTUNNELSELFINSPECTION',
                },
                {
                  label: '巷道同步',
                  key: 'sync',
                  value: 'sync',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-xiangdaotongbu',
                  desc: '同步巷道',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENDATASYNC',
                },
              ],
            ],
          ],
        },
        {
          label: '工作面',
          key: 'workFaceModuleData',
          icon: 'mc-huizhigongzuomian',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              {
                label: '工作面绘制',
                key: 'DRAWWORKFACE',
                value: 'DRAWWORKFACE',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-huizhigongzuomian',
                desc: '工作面绘制',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'DRAWWORKFACE',
              },
              {
                label: '工作面同步',
                key: 'sync',
                value: 'sync',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-xiangdaotongbu',
                desc: '工作面同步',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'OPENDATASYNCWORKFACE',
              },
            ],
          ],
        },
        {
          label: '钻孔',
          key: 'drillHoleModuleData',
          icon: 'mc-zuankong',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              {
                label: '钻孔\n管理',
                key: 'OPEN_DRILL_HOLE_DATA_MANAGE',
                value: 'OPEN_DRILL_HOLE_DATA_MANAGE',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-zuankong',
                desc: '钻孔管理',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'OPENDRILLHOLEDATAMANAGE',
              },
              {
                label: '绘制\n钻孔',
                key: 'DRAW_DRILL_HOLE',
                value: 'DRAW_DRILL_HOLE',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-zuankongzuanji',
                desc: '绘制钻孔',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'DRAWDRILLHOLE',
              },
              {
                label: '批量\n绘制',
                key: 'BATCH_DRAW_DRILL_HOLE',
                value: 'BATCH_DRAW_DRILL_HOLE',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-piliangxiugai',
                desc: '批量绘制钻孔',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'BATCHDRAWDRILLHOLE',
              },
              {
                label: '钻孔\n同步',
                key: 'DRILL_HOLE_SYNC',
                value: 'DRILL_HOLE_SYNC',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-xiangdaotongbu',
                desc: '钻孔同步',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'OPENDATASYNCDRILLHOLE',
              },
              [
                {
                  label: '柱状模板',
                  key: 'OPEN_DRILL_HOLE_COLUMN_TEMPLATE',
                  value: 'OPEN_DRILL_HOLE_COLUMN_TEMPLATE',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-yangshiguanli',
                  desc: '柱状模板',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENDRILLHOLECOLUMNTEMPLATEMANAGER',
                },
                {
                  label: '文件模板',
                  key: 'OPEN_DRILL_HOLE_FILE_TEMPLATE',
                  value: 'OPEN_DRILL_HOLE_FILE_TEMPLATE',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-bendiwenjian',
                  desc: '文件模板',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENDRILLHOLEFILEFORMATMANAGER',
                },
                {
                  label: '钻孔模板',
                  key: 'OPEN_DRILL_HOLE_TEMPLATE',
                  value: 'OPEN_DRILL_HOLE_TEMPLATE',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-peizhi',
                  desc: '钻孔模板',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENDRILLHOLETEMPLATEMANAGER',
                },
              ],
            ],
          ],
        },
        {
          label: '硐室管理',
          key: 'caveManageModuleData',
          icon: 'mc-diceng',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          width: '136',
          children: [
            [
              {
                label: '绘制\n硐室',
                key: 'drawCave',
                value: 'drawCave',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-dongshi',
                desc: '绘制硐室',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'CHAMBER',
              },
              {
                label: '硐室\n管理',
                key: 'caveManage',
                value: 'caveManage',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-dongshiguanli',
                desc: '硐室管理',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: '', // action: 'OPENCAVEMANAGE',
              },
              {
                label: '硐室\n同步',
                key: 'CAVE_SYNC',
                value: 'CAVE_SYNC',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-xiangdaotongbu',
                desc: '硐室同步',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'OPENCHAMBERDATASYNC', // action: 'OPENCAVESYNC',
              },
            ],
          ],
        },
        {
          label: '断层管理',
          key: 'faultManagementModuleData',
          icon: 'mc-diceng',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          width: '136',
          children: [
            [
              {
                label: '绘制\n大断层',
                key: 'drawLargeFault',
                value: 'drawLargeFault',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-duanceng',
                desc: '绘制大断层',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'LARGESTRUCT',
              },
              {
                label: '绘制\n小断层',
                key: 'drawMinFault',
                value: 'drawMinFault',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-duanceng',
                desc: '绘制小断层',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'MINFAULT',
              },
            ],
          ],
        },
        {
          label: '地层管理',
          key: 'stratumManagementModuleData',
          icon: 'mc-diceng',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          children: [
            [
              {
                label: '地层\n管理',
                key: 'OPENSTRATUMMANAGEMENT',
                value: 'OPENSTRATUMMANAGEMENT',
                icon: 'mc-diceng',
                iconSize: window.MCEDITOR.TopMenuIconSize.LARGE,
                desc: '地层管理',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'OPENSTRATUMMANAGEMENT',
                detailToolTip: [
                  { text: '打开地层管理面板', isDelay: false },
                ],
              },
            ],
          ],
        },
        {
          label: '管线',
          key: 'pipelineModuleData',
          icon: 'mc-guanxian',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          width: '136',
          children: [
            [
              {
                label: '绘制管线',
                key: 'pipelineDataManage',
                value: 'pipelineDataManage',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-guanxian',
                desc: '绘制管线',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                // action: 'OPENPIPELINEDEFAULTSETTING',
                action: 'DRAWPIPE',
              },
              [
                {
                  label: '打断',
                  key: 'breakPipe',
                  value: 'breakPipe',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-daduanxiangdao',
                  desc: '打断管线',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'BREAKPIPE',
                },
                {
                  label: '连接',
                  key: 'connectPipe',
                  value: 'connectPipe',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-guanxianlianjie',
                  desc: '连接管线',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'CONNECTPIPE',
                },
                {
                  label: '合并',
                  key: 'mergePipe',
                  value: 'mergePipe',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-guanxianhebing',
                  desc: '合并管线',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'MERGEPIPE',
                },
              ],
              [
                {
                  label: '管线同步',
                  key: 'syncPipe',
                  value: 'syncPipe',
                  iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
                  icon: 'mc-xiangdaotongbu',
                  desc: '同步管线',
                  type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                  displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
                  action: 'OPENPIPELINEDATASYNC',
                },
              ],
            ],
          ],
        },
        {
          label: '更多模型',
          key: 'moreModelModuleData',
          icon: 'mc-gengduomoxing',
          iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
          width: '136',
          children: [
            [
            //   [
            //     {
            //       label: '巷道自检',
            //       key: 'self_check',
            //       value: 'self_check',
            //       iconSize: window.MCEDITOR.TopMenuIconSize.MINI,
            //       icon: 'mc-xiangdaozijian',
            //       desc: '巷道自检',
            //       type: window.MCEDITOR.TopMenuType.ICON_TEXT,
            //       displayType: window.MCEDITOR.TopMenuDisplayType.HORIZONTAL,
            //       action: 'OPENTUNNELSELFINSPECTION',
            //     },
            //   ],
              {
                label: '更多模型',
                key: 'moreModelTestEntity',
                value: 'moreModelTestEntity',
                iconSize: window.MCEDITOR.TopMenuIconSize.XLARGE,
                icon: 'mc-gengduomoxing',
                desc: '更多模型',
                type: window.MCEDITOR.TopMenuType.ICON_TEXT,
                displayType: window.MCEDITOR.TopMenuDisplayType.VERTICAL,
                action: 'OPENMODELPANELS',
              },
            ],
          ],
        },
      ],
    },
   ],
  // 顶部菜单（文件）
  topMenuList: [
    {
      key: 'newFile',
      label: '新建',
      icon: 'mc-xinjianwenjian',
      action: 'NEW',
    },
    {
      key: 'openFile',
      label: '打开',
      icon: 'mc-dakaibendiwenjian',
      action: '',
      children: [
        {
          key: 'openLocalFile',
          label: '本地图纸',
          icon: 'mc-dakaibendiwenjian',
          action: 'OPEN',
        },
        {
          key: 'openCloudFile',
          label: '云端图纸',
          icon: 'mc-yunduanwenjian',
          action: 'OPENCLOUDDRAWING',
        },
      ],
    },
    {
      key: 'importImage',
      label: '导入图片',
      icon: 'mc-daorutupian',
      divider: true,
      needCore: true,
      action: 'IMAGE',
    },
    {
      key: 'saveAsOtherDwg',
      label: '另存为',
      icon: 'mc-lingcun',
      children: [
        {
          key: 'saveAsDwg',
          label: 'DWG图纸',
          needCore: true,
          value: window.MCCORE.CoreConvertFileType.DWG,
          action: 'SAVEASDRAWINGFILEACTION',
        },
        {
          key: 'saveAsDxf',
          label: 'DXF图纸',
          needCore: true,
          value: window.MCCORE.CoreConvertFileType.DXF,
          action: 'SAVEASDRAWINGFILEACTION',

        },
        {
          key: 'saveAsMctf',
          label: 'MCTF图纸',
          needCore: true,
          value: window.MCCORE.CoreConvertFileType.MCTF,
          action: 'SAVEASDRAWINGFILEACTION',
        },
        {
          key: 'saveAsMcd',
          label: 'MCD图纸',
          needCore: true,
          value: window.MCCORE.CoreConvertFileType.MCD,
          action: 'SAVEASDRAWINGFILEACTION',
        },
      ],
    },
    {
      key: 'export',
      label: '导出',
      icon: 'mc-daochu',
      children: [
        {
          key: 'BMP',
          needCore: true,
          label: 'BMP图片',
          value: {
            key: 'BMP',
            value: 3,
          },
          action: 'EXPORTDRAWINGACTION',
        },
        {
          key: 'JPG',
          needCore: true,
          label: 'JPG图片',
          value: {
            key: 'JPG',
            value: 1,
          },
          action: 'EXPORTDRAWINGACTION',
        },
        {
          key: 'PNG',
          needCore: true,
          label: 'PNG图片',
          value: {
            key: 'PNG',
            value: 2,
          },
          action: 'EXPORTDRAWINGACTION',
        },
        {
          key: 'SVG',
          needCore: true,
          label: 'SVG图片',
          value: {
            key: 'SVG',
            value: 5,
          },
          action: 'EXPORTDRAWINGACTION',
        },
        {
          key: 'pdf',
          label: 'PDF文件',
          value: {
            key: 'pdf',
            value: 4,
          },
          needCore: true,
          action: 'EXPORTDRAWINGACTION',
        },
      ],
    },
    {
      key: 'print',
      label: '打印',
      icon: 'mc-dayin',
      action: 'PLOT',
    },
    {
      key: 'localCache',
      label: '缓存',
      icon: 'mc-xitonghuancun',
      action: '',
      children: [
        {
          key: 'fileToLocalCache',
          label: '缓存到本地',
          icon: 'mc-home-page',
          action: 'LOCALCACHEAPI',
        },
        {
          key: 'clearDbCache',
          label: '清除图纸缓存',
          icon: 'mc-qingkong',
          actionFun: async (core) => {
            if (!core) return;
            const drawInfo = window.MCEDITOR.getBaseInfoFromEditor();
            // drawInfo
            try {
              window.MCEDITOR.mcDwgCacheDb.deleteRecord(drawInfo.ID);
              window.MCCORE.McNotification.success(window.maslg.get('清除成功！'));
            } catch (error) {
              window.MCCORE.McNotification.warning(window.maslg.get(error.message));
            }
          },
        },
      ],
    },
  ],
  // 顶部菜单（工具）
  topToolList: [
    {
      label: '保存',
      key: 'SAVEANDUPDATECOLLECTION',
      placement: 'left',
      needCore: true,
      icon: 'mc-baocun',
      detailToolTip: [
        { text: '更新采集图纸文件和巷道采集数据', isDelay: false },
      ],
      action: 'SAVEANDUPDATECOLLECTION',
    },
    {
      label: '生成缩略图',
      key: 'GENERATETHUMBNAILACTION',
      placement: 'left',
      needCore: true,
      icon: 'mc-bianjie',
      detailToolTip: [
        { text: '更新图纸缩略图，方便查看', isDelay: false },
      ],
      action: 'GENERATETHUMBNAILACTION',
    },
    {
      label: '撤销',
      key: 'undo',
      placement: 'left',
      needCore: true,
      detailToolTip: [
        { text: '撤销控制', isDelay: false },
      ],
      icon: 'mc-chexiao',
      actionFun: (core) => {
        core.getCommandManager().execCommandFn('UNDO', false);
      },
    },
    {
      label: '重做',
      key: 'redo',
      placement: 'left',
      needCore: true,
      icon: 'mc-zhongzuo',
      detailToolTip: [
        { text: '重做控制', isDelay: false },
      ],
      actionFun: (core) => {
        core.getCommandManager().execCommandFn('REDO', false);
      },
    },
    {
      label: '样式',
      key: 'style',
      placement: 'left',
      detailToolTip: [
        { text: '样式管理', isDelay: false },
      ],
      icon: 'mc-yangshiguanli',
      children: [
        {
          key: 'layerStyle',
          label: '图层特性',
          icon: 'mc-tucengtexing',
          needCore: true,
          actionFun: () => {
            window.MCEDITOR.topModuleToolUtils.openLayerFeature();
          },
        },
        {
          key: 'color',
          label: '颜色',
          icon: 'mc-tucengtexing',
          needCore: true,
          actionFun: (core) => {
            window.MCEDITOR.topToolUtils.openColorManager(core);
          },
        },
        {
          key: 'lineType',
          label: '线型',
          icon: 'mc-texingxianxing',
          needCore: true,
          actionFun: (core) => {
            window.MCCORE.execCommand('LINETYPE', core);
          },
        },
        {
          key: 'textStyle',
          label: '文字样式',
          icon: 'mc-zhushiwenziyangshi',
          needCore: true,
          actionFun: (core) => {
            window.MCEDITOR.topToolUtils.openTextStyleManagerMenu(core);
          },
        },
        {
          key: 'labelStyle',
          label: '标注样式',
          needCore: true,
          icon: 'mc-zhushibiaozhuyangshi',
          actionFun: (core) => {
            window.MCEDITOR.topToolUtils.openAnnotationStyleManagerMenu(core);
          },
          action: '',
        },
        {
          key: 'yxStyle',
          label: '引线样式',
          needCore: true,
          icon: 'mc-zhushiduozhongyinxianyangshi',
          actionFun: (core) => {
            window.MCEDITOR.topToolUtils.openMultipleLeadStylesManagerMenu(core);
          },
        },
        {
          key: 'pointStyle',
          label: '点样式',
          needCore: true,
          icon: 'mc-dianyangshi',
          actionFun: (core) => {
            window.MCEDITOR.topToolUtils.openPointStyleManagerMenu(core);
          },
        },
        {
          key: 'imageDefinition',
          label: '图片定义',
          needCore: true,
          icon: 'mc-dianyangshi',
          actionFun: (core) => {
            window.MCEDITOR.topToolUtils.openRasterImageManagerMenu(core);
          },
        },
      ],
    },
    {
      label: '系统配置',
      key: 'systemConfig',
      detailToolTip: [
        { text: '开启系统配置，可配置系统参数、主题、公共配置', isDelay: false },
      ],
      placement: 'left',
      icon: 'mc-xitongpeizhi',
      action: 'OPTIONS',
    },
    {
      label: '说明文档',
      key: 'helpDoc',
      detailToolTip: [
        { text: '系统教程文档，系统详细使用说明', isDelay: false },
      ],
      placement: 'left',
      icon: 'mc-bangzhu1',
      actionFun() {
        window.open(location.origin + '/pages/cloudCAD/guide/index.html', '_blank');
      },
    },

    {
      key: 'search',
      label: '搜索',
      icon: 'mc-sousuo1',
      detailToolTip: [
        { text: '搜索图纸中的实体', isDelay: false },
      ],
      action: 'QSELECT',
    },
    {
      label: '全屏',
      key: 'fullscreen',
      icon: 'mc-quanping',
      active: false,
      detailToolTip: [
        { text: '点击后，进入全屏', isDelay: false },
      ],
      activeIcon: 'mc-tuichuquanping',
      action: 'OPENFULLSCREEN',
    },
    {
      label: '返回',
      key: 'backToDrawingPage',
      icon: 'mc-tuichuyulan',
      detailToolTip: [
        { text: '返回采集图纸页面', isDelay: false },
      ],
      action: 'EXITCOLLECTIONTOOL',
    },
  ],
  // 底部菜单
  bottomMenuList: [
    {
      label: '栅格',
      icon: 'mc-zhage',
      key: 'grid',
      detailToolTip: [
        { text: '栅格控制', isDelay: false },
      ],
      divider: true,
      active: false,
      action: 'SETGRID',
    },
    {
      label: '正交',
      icon: 'mc-zhengjiao',
      key: 'orthogonality',
      active: false,
      divider: true,
      detailToolTip: [
        { text: '正交控制', isDelay: false },
      ],
      action: 'SETORTHOMODE',
    },
    {
      label: '极轴',
      icon: 'mc-jizhou',
      key: 'polarAxis',
      action: 'SETAXISTRACK',
      detailToolTip: [
        { text: '设置极轴', isDelay: false },
      ],
      children: [
        {
          key: 'polarAxis',
          label: '90, 180, 270, 360',
          icon: '',
          value: '90',
        },
        {
          key: 'polarAxis',
          label: '45, 90, 135, 180',
          icon: '',
          value: '45',
        },
        {
          key: 'polarAxis',
          label: '30, 60, 90, 120',
          icon: '',
          value: '30',
        },
        {
          key: 'polarAxis',
          label: '23, 45, 68, 90',
          icon: '',
          value: '23',
        },
        {
          key: 'polarAxis',
          label: '18, 36, 54, 72',
          icon: '',
          value: '18',
        },
        {
          key: 'polarAxis',
          label: '15, 30, 45, 60',
          icon: '',
          value: '15',
        },
        {
          key: 'polarAxis',
          label: '10, 20, 30, 40',
          icon: '',
          value: '10',
        },
        {
          key: 'polarAxis',
          label: '5, 10, 15, 20',
          icon: '',
          value: '5',
        },
      ],
    },
    {
      label: '对象捕捉',
      icon: 'mc-duixiangbuzhuo',
      key: 'objectCapture',
      action: 'SETOBJCAPTURE',
      detailToolTip: [
        { text: '对象捕捉、端点、中点等', isDelay: false },
      ],
      children: [
        {
          key: 'objectCapture',
          label: '端点',
          icon: 'mc-duandian',
          value: window.MCCORE.OSnapMode.kOsModeEnd,
        },
        {
          key: 'objectCapture',
          label: '中点',
          icon: 'mc-zhongdian',
          value: window.MCCORE.OSnapMode.kOsModeMid,
        },
        {
          key: 'objectCapture',
          label: '圆心',
          icon: 'mc-yuanxin',
          value: window.MCCORE.OSnapMode.kOsModeCen,
        },
        {
          key: 'objectCapture',
          label: '节点',
          icon: 'mc-jiedian',
          value: window.MCCORE.OSnapMode.kOsModeNode,
        },
        {
          key: 'objectCapture',
          label: '象限点',
          icon: 'mc-xiangxiandian',
          value: window.MCCORE.OSnapMode.kOsModeQuad,
        },
        {
          key: 'objectCapture',
          label: '交点',
          icon: 'mc-fanwei',
          value: window.MCCORE.OSnapMode.kOsModeInt,
        },
        {
          key: 'objectCapture',
          label: '插入',
          icon: 'mc-charu',
          value: window.MCCORE.OSnapMode.kOsModeIns,
        },
        {
          key: 'objectCapture',
          label: '垂足',
          icon: 'mc-chuizu',
          value: window.MCCORE.OSnapMode.kOsModePerp,
        },
        {
          key: 'objectCapture',
          label: '切点',
          icon: 'mc-qiedian',
          value: window.MCCORE.OSnapMode.kOsModeTan,
        },
        {
          key: 'objectCapture',
          label: '最近点',
          icon: 'mc-zuijindian',
          value: window.MCCORE.OSnapMode.kOsModeNear,
        },
        {
          key: 'objectCapture',
          label: '几何中心',
          icon: 'mc-zuijindian',
          value: window.MCCORE.OSnapMode.kOsModeGeom,
        },
        {
          key: 'objectCapture',
          label: '延长线',
          icon: 'mc-yanchangxian',
          value: window.MCCORE.OSnapMode.kOsModeExt,
        },
        {
          key: 'objectCapture',
          label: '中线点',
          icon: 'mc-zhongdian',
          value: window.MCCORE.OSnapMode.kOsModeTLCenter,
        },
      ],
    },
    {
      label: '线宽显示',
      icon: 'mc-xiankuanxianshi',
      key: 'lineWidthShow',
      divider: true,
      active: false,
      detailToolTip: [
        { text: '设置线宽显示', isDelay: false },
      ],
      action: 'SETLINEWIDTHSHOW',
    },
    {
      label: '透明度',
      icon: 'mc-toumingdu',
      key: 'opacity',
      active: false,
      detailToolTip: [
        { text: '设置透明度', isDelay: false },
      ],
      action: 'SETOPACITY',
    },
    {
      key: '2dView',
      label: '二维',
      divider: true,
      icon: 'mc-erwei',
      action: 'SETVIEWTYPE',
      detailToolTip: [
        { text: '设置视图', isDelay: false },
      ],
      children: [
        {
          key: '2dView',
          label: '二维',
          icon: 'mc-erwei',
          action: 'SETVIEWTYPE',
        },
        {
          key: '3dView',
          label: '三维',
          icon: 'mc-sanwei',
          action: 'SETVIEWTYPE',
        },
        {
          key: '23dView',
          label: '二三维',
          icon: 'mc-ersanweiliandong',
          action: 'SETVIEWTYPE',
        },
      ],
    },
    {
      label: '视图同步',
      icon: 'mc-shitutongbu',
      key: '23dViewSync',
      active: false,
      disabled: true,
      detailToolTip: [
        { text: '设置视图同步', isDelay: false },
      ],
      action: 'SETVIEWSYNC',
    },
  ],
};

