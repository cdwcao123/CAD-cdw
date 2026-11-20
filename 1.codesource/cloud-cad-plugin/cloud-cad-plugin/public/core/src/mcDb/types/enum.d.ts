declare enum SplineType {
    eFit = 0,
    eControl = 1
}
declare enum PolylineSmoothType {
    NoSmooth = 0,
    Quadratic = 5,
    Cubic = 6
}
declare enum HatchLoopType {
    kDefault = 0,
    kExternal = 1,
    kPolyline = 2,
    kDerived = 4,
    kTextbox = 8,
    kOutermost = 16,
    kNotClosed = 32,
    kSelfIntersecting = 64,
    kTextIsland = 128,
    kDuplicate = 256,
    kIsAnnotative = 512,
    kDoesNotSupportScale = 1024,
    kForceAnnoAllVisible = 2048,
    kOrientToPaper = 4096,
    kIsAnnotativeBlock = 8192
}
declare enum HatchEdgeType {
    kLine = 1,
    kCirArc = 2,
    kEllArc = 3,
    kSpline = 4
}
declare enum HatchObjectType {
    kHatchObject = 0,
    kGradientObject = 1
}
declare enum HatchPatternType {
    kUserDefined = 0,
    kPreDefined = 1,
    kCustomDefined = 2
}
declare enum HatchStyle {
    kNormal = 0,
    kOuter = 1,
    kIgnore = 2
}
declare enum GradientPatternType {
    kPreDefinedGradient = 0,
    kUserDefinedGradient = 1
}
declare enum HatchGradientPatternType {
    Linear = "LINEAR",
    Cylinder = "CYLINDER",
    InvCylinder = "INVCYLINDER",
    Spherical = "SPHERICAL",
    InvSpherical = "INVSPHERICAL",
    HemiSpherical = "HEMISPHERICAL",
    InvHemiSpherical = "INVHEMISPHERICAL",
    Curved = "CURVED",
    InvCurved = "INVCURVED"
}
declare enum TextHorizontalMode {
    kTextLeft = 0,
    kTextCenter = 1,
    kTextRight = 2,
    kTextAlign = 3,
    kTextMid = 4,
    kTextFit = 5
}
declare enum TextVerticalMode {
    kTextBase = 0,
    kTextBottom = 1,
    kTextVertMid = 2,
    kTextTop = 3
}
declare enum TextAlignment {
    kTextAlignmentLeft = 0,
    kTextAlignmentCenter = 1,
    kTextAlignmentRight = 2,
    kTextAlignmentAligned = 3,
    kTextAlignmentMiddle = 4,
    kTextAlignmentFit = 5,
    kTextAlignmentTopLeft = 6,
    kTextAlignmentTopCenter = 7,
    kTextAlignmentTopRight = 8,
    kTextAlignmentMiddleLeft = 9,
    kTextAlignmentMiddleCenter = 10,
    kTextAlignmentMiddleRight = 11,
    kTextAlignmentBottomLeft = 12,
    kTextAlignmentBottomCenter = 13,
    kTextAlignmentBottomRight = 14
}
declare enum TextAttachment {
    kTopLeft = 1,
    kTopCenter = 2,
    kTopRight = 3,
    kMiddleLeft = 4,
    kMiddleCenter = 5,
    kMiddleRight = 6,
    kBottomLeft = 7,
    kBottomCenter = 8,
    kBottomRight = 9
}
declare enum FlowDirection {
    kLtoR = 1,
    kRtoL = 2,
    kTtoB = 3,
    kBtoT = 4,
    kByStyle = 5
}
declare enum LineSpacingStyle {
    kAtLeast = 1,
    kExactly = 2
}
declare enum McDbLineWeight {
    kLnWt000 = 0,
    kLnWt005 = 5,
    kLnWt009 = 9,
    kLnWt013 = 13,
    kLnWt015 = 15,
    kLnWt018 = 18,
    kLnWt020 = 20,
    kLnWt025 = 25,
    kLnWt030 = 30,
    kLnWt035 = 35,
    kLnWt040 = 40,
    kLnWt050 = 50,
    kLnWt053 = 53,
    kLnWt060 = 60,
    kLnWt070 = 70,
    kLnWt080 = 80,
    kLnWt090 = 90,
    kLnWt100 = 100,
    kLnWt106 = 106,
    kLnWt120 = 120,
    kLnWt140 = 140,
    kLnWt158 = 158,
    kLnWt200 = 200,
    kLnWt211 = 211,
    kLnWtByLayer = -1,
    kLnWtByBlock = -2,
    kLnWtByLwDefault = -3
}
declare enum DimensionStyleTextVerticalPlacement {
    Centered = 0,
    Above = 1,
    Outside = 2,
    JIS = 3,
    Below = 4
}
declare enum DimensionTextHorizontalJustification {
    Centered = 0,
    FirstExtensionLine = 1,
    SecondExtensionLine = 2,
    AboveFirstExtensionLine = 3,
    AboveSecondExtensionLine = 4
}
declare enum DimensionStyleTextDirection {
    LeftToRight = 0,
    RightToLeft = 1
}
declare enum DimensionTextAlignmentType {
    Horizontal = 0,
    AlignmentToDimLine = 1,
    ISOStandard = 2
}
declare enum DimensionStyleFitOptions {
    BothOutside = 0,
    ArrowsFirst = 1,
    TextFirst = 2,
    Auto = 3
}
declare enum DimensionStyleFitTextMove {
    BesideDimLine = 0,
    OverDimLineWithLeader = 1,
    OverDimLineWithoutLeader = 2
}
declare enum LinearUnitType {
    Scientific = 1,
    Decimal = 2,
    Engineering = 3,
    Architectural = 4,
    Fractional = 5,
    WindowsDesktop = 6
}
declare enum AngleUnitType {
    DecimalDegrees = 0,
    DegreesMinutesSeconds = 1,
    Gradians = 2,
    Radians = 3,
    SurveyorUnits = 4
}
declare enum FractionFormatType {
    Horizontal = 0,
    Diagonal = 1,
    NotStacked = 2
}
declare enum DimensionStyleTolerancesDisplayMethod {
    None = 0,
    Symmetrical = 1,
    Deviation = 2,
    Limits = 3
}
declare enum DimensionStyleTolerancesVerticalPlacement {
    Bottom = 0,
    Middle = 1,
    Top = 2
}
declare enum MaterialGeoType {
    kPoint = 0,
    kLine = 1,
    kSurFace = 2
}
declare enum GripType {
    gtEnd = 0,
    gtMid = 1,
    gtCen = 2,
    gtNode = 3,
    gtInt = 4,
    gtIns = 5,
    gtPer = 6,
    gtTan = 7,
    gtNear = 8,
    gtDir = 9,
    gtQuad = 10
}
declare enum GripStyle {
    gsRect = 0,
    gsSquare = 1,
    gsRing = 2,
    gsSArrow = 3,
    gsDArrow = 4,
    gsCross = 5,
    gsTri = 6
}
declare enum RowSpacingType {
    Multi = 0,
    Last = 1,
    Accurate = 2
}
declare enum McDbMTextContextPropertyType {
    mtcpStyle = 0,
    mtcpFont = 1,
    mtcpHeight = 2,
    mtcpRotation = 3,
    mtcpColor = 4,
    mtcpBackColor = 5,
    mtcpBold = 6,
    mtcpItalic = 7,
    mtcpUnderLine = 8,
    mtcpDeleteLine = 9,
    mtcpOverLine = 10,
    mtcpFraction = 11,
    mtcpSuperscript = 12,
    mtcpSubscript = 13,
    mtcpLowercase = 14,
    mtcpUppercase = 15,
    mtcpClearAllStyle = 16,
    mtcpRowSpacingType = 17,
    mtcpRowSpacing = 18,
    mtcpAttachment = 19,
    mtcpHorizontalMode = 20,
    mtcpBulletPointsAndMarkers = 21,
    mtcpItalicAngle = 22,
    mtcpLetterSpacing = 23,
    mtcpWidthFactor = 24,
    mtcpFormatPainter = 25,
    mtcpClearTextFormat = 26,
    mtcpClearParagraphFormat = 27,
    mtcpTextField = 28,
    mtcpSymbol = 29,
    mtcpEscQuitOption = 30
}
declare enum McDbMTextContextPropertyEvent {
    mtcpeOpenPanel = 0,
    mtcpeClosePanel = 1
}
declare enum DimArcSymbolPositionType {
    BeforeText = 0,
    AboveText = 1,
    None = 2
}
declare enum LineTypeSegmentType {
    dash = 0,
    dot = 1,
    space = 2,
    text = 3,
    shape = 4
}
declare enum McDbMTextContentStyleSignType {
    mtcsstNone = 0,
    mtcsstBullets = 1,
    mtcsstNumber = 2,
    mtcsstUppercase = 3,
    mtcsstLowercase = 4,
    mtcsstClear = 5
}
declare enum DimensionStyleOverrideType {
    DimLineColor = 0,
    DimLineLinetype = 1,
    DimLineLineweight = 2,
    DimLine1Off = 3,
    DimLine2Off = 4,
    DimLineExtend = 5,
    ExtLineColor = 6,
    ExtLine1Linetype = 7,
    ExtLine2Linetype = 8,
    ExtLineLineweight = 9,
    ExtLine1Off = 10,
    ExtLine2Off = 11,
    ExtLineOffset = 12,
    ExtLineExtend = 13,
    ExtLineFixed = 14,
    ExtLineFixedLength = 15,
    DimArrow1 = 16,
    DimArrow2 = 17,
    LeaderArrow = 18,
    ArrowSize = 19,
    CenterMarkSize = 20,
    TextStyle = 21,
    TextColor = 22,
    TextFillColor = 23,
    TextHeight = 24,
    TextVerticalPlacement = 25,
    TextHorizontalPlacement = 26,
    TextInsideAlign = 27,
    TextOutsideAlign = 28,
    TextOffset = 29,
    TextDirection = 30,
    TextFractionHeightScale = 31,
    FitDimLineForce = 32,
    FitDimLineInside = 33,
    DimScaleOverall = 34,
    FitOptions = 35,
    FitTextInside = 36,
    FitTextMove = 37,
    AngularPrecision = 38,
    LengthPrecision = 39,
    DimPrefix = 40,
    DimSuffix = 41,
    DecimalSeparator = 42,
    DimScaleLinear = 43,
    DimLengthUnits = 44,
    DimAngularUnits = 45,
    FractionalType = 46,
    SuppressLinearLeadingZeros = 47,
    SuppressLinearTrailingZeros = 48,
    SuppressAngularLeadingZeros = 49,
    SuppressAngularTrailingZeros = 50,
    SuppressZeroFeet = 51,
    SuppressZeroInches = 52,
    DimRoundoff = 53,
    AltUnitsEnabled = 54,
    AltUnitsLengthUnits = 55,
    AltUnitsStackedUnits = 56,
    AltUnitsLengthPrecision = 57,
    AltUnitsMultiplier = 58,
    AltUnitsRoundoff = 59,
    AltUnitsPrefix = 60,
    AltUnitsSuffix = 61,
    AltUnitsSuppressLinearLeadingZeros = 62,
    AltUnitsSuppressLinearTrailingZeros = 63,
    AltUnitsSuppressZeroFeet = 64,
    AltUnitsSuppressZeroInches = 65,
    TolerancesDisplayMethod = 66,
    TolerancesUpperLimit = 67,
    TolerancesLowerLimit = 68,
    TolerancesVerticalPlacement = 69,
    TolerancesPrecision = 70,
    TolerancesSuppressLinearLeadingZeros = 71,
    TolerancesSuppressLinearTrailingZeros = 72,
    TolerancesSuppressZeroFeet = 73,
    TolerancesSuppressZeroInches = 74,
    TolerancesAlternatePrecision = 75,
    TolerancesAltSuppressLinearLeadingZeros = 76,
    TolerancesAltSuppressLinearTrailingZeros = 77,
    TolerancesAltSuppressZeroFeet = 78,
    TolerancesAltSuppressZeroInches = 79
}
declare enum MLeaderDimensionPropertyOverrideType {
    kLeaderLineType = 0,
    kLeaderLineColor = 1,
    kLeaderLineTypeId = 2,
    kLeaderLineWeight = 3,
    kEnableLanding = 4,
    kLandingGap = 5,
    kEnableDogleg = 6,
    kDoglegLength = 7,
    kArrowSymbolId = 8,
    kArrowSize = 9,
    kContentType = 10,
    kTextStyleId = 11,
    kTextLeftAttachmentType = 12,
    kTextAngleType = 13,
    kTextAlignmentType = 14,
    kTextColor = 15,
    kTextHeight = 16,
    kEnableFrameText = 17,
    kDefaultMText = 18,
    kBlockId = 19,
    kBlockColor = 20,
    kBlockScale = 21,
    kBlockRotation = 22,
    kBlockConnectionType = 23,
    kScale = 24,
    kTextRightAttachmentType = 25,
    kTextSwitchAlignmentType = 26,
    kTextAttachmentDirection = 27,
    kTextTopAttachmentType = 28,
    kTextBottomAttachmentType = 29,
    kExtendLeaderToText = 30,
    kSize = 31
}
declare enum MLeaderDimensionContentType {
    kNoneContent = 0,
    kBlockContent = 1,
    kMTextContent = 2,
    kToleranceContent = 3
}
declare enum MLeaderDimensionType {
    kInVisibleLeader = 0,
    kStraightLeader = 1,
    kSplineLeader = 2
}
declare enum MLeaderDimensionTextAttachmentType {
    kAttachmentTopOfTop = 0,
    kAttachmentMiddleOfTop = 1,
    kAttachmentMiddle = 2,
    kAttachmentMiddleOfBottom = 3,
    kAttachmentBottomOfBottom = 4,
    kAttachmentBottomLine = 5,
    kAttachmentBottomOfTopLine = 6,
    kAttachmentBottomOfTop = 7,
    kAttachmentAllLine = 8,
    kAttachmentCenter = 9,
    kAttachmentLinedCenter = 10
}
declare enum MLeaderDimensionTextAttachmentDirection {
    kAttachmentHorizontal = 0,
    kAttachmentVertical = 1
}
declare enum MLeaderDimensionTextAngleType {
    kInsertAngle = 0,
    kHorizontalAngle = 1,
    kAlwaysRightReadingAngle = 2
}
declare enum MLeaderDimensionTextAlignmentType {
    kLeftAlignment = 0,
    kCenterAlignment = 1,
    kRightAlignment = 2
}
declare enum MLeaderDimensionBlockConnectionType {
    kConnectExtents = 0,
    kConnectBase = 1
}
declare enum LeaderDirectionType {
    kUnknownLeader = 0,
    kLeftLeader = 1,
    kRightLeader = 2,
    kTopLeader = 3,
    kBottomLeader = 4
}
declare enum LeaderSegmentAngleType {
    kAny = 0,
    k15 = 1,
    k30 = 2,
    k45 = 3,
    k60 = 4,
    k90 = 6,
    kHorz = 12
}
declare enum ResolutionUnit {
    Unitless = 0,
    Centimeters = 2,
    Inch = 5
}
declare enum ImageDisplayFlags {
    ShowImage = 1,
    ShowImageWhenNotAlignedWithScreen = 2,
    UseClippingBoundary = 4,
    TransparencyOn = 8
}
declare enum ClippingBoundaryType {
    Rectangular = 1,
    Polygonal = 2
}
declare enum ConstrainType {
    kTurnHeight = 0,
    kTurns = 1,
    kHeight = 2
}
declare enum GripViewMode {
    View2D = 0,
    View3D = 1,
    ViewAll = 2
}
declare enum CellType {
    kUnknownCell = 0,
    kTextCell = 1,
    kBlockCell = 2,
    kMultipleContentCell = 3
}
declare enum CellContentType {
    kCellContentTypeUnknown = 0,
    kCellContentTypeValue = 1,
    kCellContentTypeField = 2,
    kCellContentTypeBlock = 4
}
declare enum CellEdgeMask {
    kTopMask = 1,
    kRightMask = 2,
    kBottomMask = 4,
    kLeftMask = 8
}
declare enum CellMargin {
    kCellMarginTop = 1,
    kCellMarginLeft = 2,
    kCellMarginBottom = 4,
    kCellMarginRight = 8,
    kCellMarginHorzSpacing = 16,
    kCellMarginVertSpacing = 32
}
declare enum CellContentLayout {
    kCellContentLayoutFlow = 1,
    kCellContentLayoutStackedHorizontal = 2,
    kCellContentLayoutStackedVertical = 4
}
declare enum CellState {
    kCellStateNone = 0,
    kCellStateContentLocked = 1,
    kCellStateContentReadOnly = 2,
    kCellStateLinked = 4,
    kCellStateContentModifiedAfterUpdate = 8,
    kCellStateFormatLocked = 16,
    kCellStateFormatReadOnly = 32,
    kCellStateFormatModifiedAfterUpdate = 64,
    kAllCellStates = 127
}
declare enum CellClass {
    kCellClassNone = 0,
    kCellClassLabel = 1,
    kCellClassData = 2
}
declare enum CellPropertyFlag {
    kCellPropInvalid = 0,
    kCellPropAlignment = 16,
    kCellPropBackgroundColor = 512,
    kCellPropMarginLeft = 1024,
    kCellPropMarginTop = 2048,
    kCellPropMarginRight = 4096,
    kCellPropMarginBottom = 8192,
    kCellPropContentLayout = 16384,
    kCellPropCellStatus = 32768
}
declare enum CellContentFlag {
    kCellContentInvalid = 0,
    kCellPropDataType = 1,
    kCellPropDataFormat = 2,
    kCellPropRotation = 4,
    kCellPropScale = 8,
    kCellPropAlignment = 16,
    kCellPropContentColor = 32,
    kCellPropTextStyle = 64,
    kCellPropTextHeight = 128,
    kCellPropAutoScale = 256,
    kCellPropDataTypeAndFormat = 3,
    kCellPropContent = 495
}
declare enum GridPropertyFlag {
    kGridPropInvalid = 0,
    kGridPropLineStyle = 1,
    kGridPropLineWeight = 2,
    kGridPropLineType = 4,
    kGridPropColor = 8,
    kGridPropVisibility = 16,
    kGridPropDoubleLineSpacing = 32,
    kGridPropAll = 63
}
declare enum GridLineType {
    kInvalidGridLine = 0,
    kHorzTop = 1,
    kHorzInside = 2,
    kHorzBottom = 4,
    kVertLeft = 8,
    kVertInside = 16,
    kVertRight = 32,
    kHorzGridLineTypes = 7,
    kVertGridLineTypes = 56,
    kOuterGridLineTypes = 45,
    kInnerGridLineTypes = 18,
    kAllGridLineTypes = 63
}
declare enum GridLineStyle {
    kGridLineStyleSingle = 1,
    kGridLineStyleDouble = 2
}
declare enum CellOption {
    kCellOptionNone = 0,
    kInheritCellFormat = 1
}
declare enum SelectType {
    kWindow = 1,
    kCrossing = 2
}
declare enum TableFlowDirection {
    kTtoB = 0,
    kBtoT = 1
}
declare enum CellAlignment {
    kTopLeft = 1,
    kTopCenter = 2,
    kTopRight = 3,
    kMiddleLeft = 4,
    kMiddleCenter = 5,
    kMiddleRight = 6,
    kBottomLeft = 7,
    kBottomCenter = 8,
    kBottomRight = 9
}
declare enum RowType {
    kUnknownRow = 0,
    kDataRow = 1,
    kTitleRow = 2,
    kHeaderRow = 4,
    kAllRowTypes = 7
}
declare enum TableStyleFlags {
    kHorzInsideLineFirst = 1,
    kHorzInsideLineSecond = 2,
    kHorzInsideLineThird = 4,
    kTableStyleModified = 8,
    kTableStyleDataTypeModified = 16
}
declare enum TableBreakOption {
    kTableBreakNone = 0,
    kTableBreakEnableBreaking = 1,
    kTableBreakRepeatTopLabels = 2,
    kTableBreakRepeatBottomLabels = 4,
    kTableBreakAllowManualPositions = 8,
    kTableBreakAllowManualHeights = 16
}
declare enum TableBreakFlowDirection {
    kTableBreakFlowRight = 1,
    kTableBreakFlowDownOrUp = 2,
    kTableBreakFlowLeft = 4
}
declare enum TableFillOption {
    kTableFillNone = 0,
    kTableFillRow = 1,
    kTableFillReverse = 2,
    kTableFillGenerateSeries = 4,
    kTableFillCopyContent = 8,
    kTableFillCopyFormat = 16,
    kTableFillOverwriteReadOnlyContent = 32,
    kTableFillOverwriteReadOnlyFormat = 64
}
declare enum TableCopyOption {
    kTableCopyNone = 0,
    kTableCopyExpandOrContractTable = 1,
    kTableCopySkipContent = 2,
    kTableCopySkipValue = 4,
    kTableCopySkipField = 8,
    kTableCopySkipFormula = 16,
    kTableCopySkipBlock = 32,
    kTableCopySkipDataLink = 64,
    kTableCopySkipLabelCell = 128,
    kTableCopySkipDataCell = 256,
    kTableCopySkipFormat = 512,
    kTableCopySkipCellStyle = 1024,
    kTableCopyConvertFormatToOverrides = 2048,
    kTableCopySkipCellState = 4096,
    kTableCopySkipContentFormat = 8192,
    kTableCopySkipDissimilarContentFormat = 16384,
    kTableCopySkipGeometry = 32768,
    kTableCopySkipMerges = 65536,
    kTableCopyFillTarget = 131072,
    kTableCopyOverwriteReadOnlyContent = 262144,
    kTableCopyOverwriteReadOnlyFormat = 524288,
    kTableCopyOverwriteContentModifiedAfterUpdate = 1048576,
    kTableCopyOverwriteFormatModifiedAfterUpdate = 2097152,
    kTableCopyOnlyContentModifiedAfterUpdate = 4194304,
    kTableCopyOnlyFormatModifiedAfterUpdate = 8388608,
    kTableCopyRowHeight = 16777216,
    kTableCopyColumnWidth = 33554432,
    kTableCopyFullCellState = 67108864,
    kTableCopyForRountrip = 134217728,
    kTableCopyConvertFieldToValue = 268435456,
    kTableCopySkipFieldTranslation = 536870912
}
declare enum TableIteratorOption {
    kTableIteratorNone = 0,
    kTableIteratorIterateSelection = 1,
    kTableIteratorIterateRows = 2,
    kTableIteratorIterateColumns = 4,
    kTableIteratorIterateDataLinks = 128,
    kTableIteratorReverseOrder = 8,
    kTableIteratorSkipReadOnlyContent = 16,
    kTableIteratorSkipReadOnlyFormat = 32,
    kTableIteratorSkipMerged = 64
}
declare enum MergeCellStyleOption {
    kMergeCellStyleNone = 0,
    kMergeCellStyleCopyDuplicates = 1,
    kMergeCellStyleOverwriteDuplicates = 2,
    kMergeCellStyleConvertDuplicatesToOverrides = 4,
    kMergeCellStyleIgnoreNewStyles = 8
}
declare enum TableHitItem {
    kTableHitNone = 0,
    kTableHitCell = 1,
    kTableHitRowIndicator = 2,
    kTableHitColumnIndicator = 4,
    kTableHitGridLine = 8
}
declare enum RowTypes {
    kAllRows = 7
}
declare enum GridLineTypes {
    kAllGridLines = 63
}
declare enum McDataType {
    kUnknown = 0,
    kLong = 1,
    kDouble = 2,
    kString = 4,
    kDate = 8,
    kPoint = 16,
    k3dPoint = 32,
    kObjectId = 64,
    kBuffer = 128,
    kResbuf = 256,
    kGeneral = 512,
    kColor = 1024
}
declare enum McUnitType {
    kUnitless = 0,
    kDistance = 1,
    kAngle = 2,
    kArea = 4,
    kVolume = 8,
    kCurrency = 16,
    kPercentage = 32,
    kAngleNotTransformed = 65536
}
declare enum McParseOption {
    kParseOptionNone = 0,
    kSetDefaultFormat = 1,
    kPreserveMtextFormat = 2,
    kConvertTextToValue = 4,
    kChangeDataType = 8,
    kParseTextForFieldCode = 16
}
declare enum McFormatOption {
    kFormatOptionNone = 0,
    kForEditing = 1,
    kForExpression = 2,
    kUseMaximumPrecision = 4,
    kIgnoreMtextFormat = 8
}
declare enum ContentType {
    kNoneContent = 0,
    kBlockContent = 1,
    kMTextContent = 2,
    kToleranceContent = 3
}
declare enum DrawMLeaderOrderType {
    kDrawContentFirst = 0,
    kDrawLeaderFirst = 1
}
declare enum DrawLeaderOrderType {
    kDrawLeaderHeadFirst = 0,
    kDrawLeaderTailFirst = 1
}
declare enum LeaderType {
    kInVisibleLeader = 0,
    kStraightLeader = 1,
    kSplineLeader = 2
}
declare enum TextAttachmentDirection {
    kAttachmentHorizontal = 0,
    kAttachmentVertical = 1
}
declare enum TextAttachmentType {
    kAttachmentTopOfTop = 0,
    kAttachmentMiddleOfTop = 1,
    kAttachmentMiddle = 2,
    kAttachmentMiddleOfBottom = 3,
    kAttachmentBottomOfBottom = 4,
    kAttachmentBottomLine = 5,
    kAttachmentBottomOfTopLine = 6,
    kAttachmentBottomOfTop = 7,
    kAttachmentAllLine = 8,
    kAttachmentCenter = 9,
    kAttachmentLinedCenter = 10
}
declare enum TextAngleType {
    kInsertAngle = 0,
    kHorizontalAngle = 1,
    kAlwaysRightReadingAngle = 2
}
declare enum TextAlignmentType {
    kLeftAlignment = 0,
    kCenterAlignment = 1,
    kRightAlignment = 2
}
declare enum BlockConnectionType {
    kConnectExtents = 0,
    kConnectBase = 1
}
declare enum SegmentAngleType {
    kAny = 0,
    k15 = 1,
    k30 = 2,
    k45 = 3,
    k60 = 4,
    k90 = 6,
    kHorz = 12
}
declare enum PointShape {
    Dot = 0,
    Empty = 1,
    Plus = 2,
    Cross = 3,
    Line = 4,
    CircleDot = 32,
    CircleEmpty = 33,
    CirclePlus = 34,
    CircleCross = 35,
    CircleLine = 36,
    SquareDot = 64,
    SquareEmpty = 65,
    SquarePlus = 66,
    SquareCross = 67,
    SquareLine = 68,
    CircleSquareDot = 96,
    CircleSquareEmpty = 97,
    CircleSquarePlus = 98,
    CircleSquareCross = 99,
    CircleSquareLine = 100
}
declare enum DimBlock {
    dimblkClosedFilled = "",
    dimblkDot = "_DOT",
    dimblkSmallDot = "_DOTSMALL",
    dimblkDotBlank = "_DOTBLANK",
    dimblkOrigin = "_ORIGIN",
    dimblkOrigin2 = "_ORIGIN2",
    dimblkOpen = "_OPEN",
    dimblkOpen90 = "_OPEN90",
    dimblkOpen30 = "_OPEN30",
    dimblkClosed = "_CLOSED",
    dimblkSmall = "_SMALL",
    dimblkNone = "_NONE",
    dimblkOblique = "_OBLIQUE",
    dimblkBoxFilled = "_BOXFILLED",
    dimblkBoxBlank = "_BOXBLANK",
    dimblkCloseBlank = "_CLOSEDBLANK",
    dimblkDatumFilled = "_DATUMFILLED",
    dimblkDatumBlank = "_DATUMBLANK",
    dimblkIntegral = "_INTEGRAL",
    dimblkArchTick = "_ARCHTICK"
}
declare enum DimContentBlock {
    UserBlock = "",
    DetailInfo = "_DetailCallout",
    TagSlot = "_TagSlot",
    TagCircle = "_TagCircle",
    TagBox = "_TagBox",
    TagHexagon = "_TagHexagon",
    TagTriangle = "_TagTriangle"
}
declare enum EntityEditType {
    eMove = 1,
    eRotate = 2,
    eScale = 4,
    eMirror = 8,
    eStretch = 16,
    eJoin = 32,
    eTrim = 64,
    eFillet = 128,
    eChamfer = 256,
    eExtend = 512,
    eLengthen = 1024,
    eBreak = 2048,
    eBlend = 4096,
    eOffset = 8192,
    eArray = 16384,
    eExplode = 32768
}
declare enum Solid3DType {
    None = 0,
    Sphere = 1,
    Cube = 2,
    Tetrahedron = 3,
    Octahedron = 4,
    Cylinder = 5,
    PipeLine = 6,
    PolySolid = 7,
    Cuboid = 8,
    Wedge = 9,
    Cone = 10,
    FrustumCone = 11,
    Torus = 12,
    Pyramid = 13
}
declare enum HeatMapResolution {
    Low = 500,
    Medium = 1000,
    High = 2000
}
declare enum McDbIsoType {
    Top = 0,
    Bottom = 1,
    Thickness = 2
}
declare enum McDbTinShowType {
    Top = 0,
    Bottom = 1
}
declare enum McDbIsoGenerateType {
    Interval = 0,
    FixedValue = 1
}
declare enum McDbIsoLineType {
    Polyline = 0,
    Spline = 1
}
export { SplineType, HatchLoopType, HatchEdgeType, HatchObjectType, HatchPatternType, HatchStyle, GradientPatternType, TextHorizontalMode, TextVerticalMode, TextAlignment, TextAttachment, FlowDirection, LineSpacingStyle, McDbLineWeight, MaterialGeoType, DimensionStyleTextVerticalPlacement, DimensionTextHorizontalJustification, DimensionStyleTextDirection, DimensionStyleFitOptions, DimensionStyleFitTextMove, LinearUnitType, AngleUnitType, FractionFormatType, DimensionStyleTolerancesDisplayMethod, DimensionStyleTolerancesVerticalPlacement, GripType, GripStyle, PolylineSmoothType, RowSpacingType, McDbMTextContextPropertyType, McDbMTextContextPropertyEvent, DimArcSymbolPositionType, LineTypeSegmentType, McDbMTextContentStyleSignType, DimensionStyleOverrideType, MLeaderDimensionPropertyOverrideType, MLeaderDimensionContentType, MLeaderDimensionType, MLeaderDimensionTextAttachmentType, MLeaderDimensionTextAttachmentDirection, MLeaderDimensionTextAngleType, MLeaderDimensionTextAlignmentType, MLeaderDimensionBlockConnectionType, LeaderDirectionType, LeaderSegmentAngleType, ResolutionUnit, ImageDisplayFlags, ClippingBoundaryType, HatchGradientPatternType, ConstrainType, GripViewMode, CellType, CellContentType, CellEdgeMask, CellMargin, CellContentLayout, CellState, CellClass, CellPropertyFlag, CellContentFlag, GridPropertyFlag, GridLineType, GridLineStyle, CellOption, SelectType, TableFlowDirection, CellAlignment, RowType, TableStyleFlags, TableBreakOption, TableBreakFlowDirection, TableFillOption, TableCopyOption, TableIteratorOption, MergeCellStyleOption, TableHitItem, RowTypes, GridLineTypes, McDataType, McUnitType, McParseOption, McFormatOption, ContentType, DrawMLeaderOrderType, DrawLeaderOrderType, LeaderType, TextAttachmentDirection, TextAttachmentType, TextAngleType, TextAlignmentType, BlockConnectionType, SegmentAngleType, PointShape, DimBlock, EntityEditType, DimensionTextAlignmentType, DimContentBlock, Solid3DType, HeatMapResolution, McDbIsoType, McDbTinShowType, McDbIsoGenerateType, McDbIsoLineType, };
