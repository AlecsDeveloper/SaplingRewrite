import { module } from 'BPM/.js'
const lang = {EN: {}, ES: {}, PT: {}, ZH: {}, JA: {}}
// Declarations

/* English: EN */
lang.EN.invalidCommand = 'Invalid command'
lang.EN.invalidValue = 'Invalid value'
lang.EN.invalidLang = 'Invalid lang'
lang.EN.invalidAction = 'Invalid action to repeat'
lang.EN.fakeplayerInvalid = 'You can only manipulate existing players'
lang.EN.fakeplayerConnected = 'are connected'
lang.EN.newLang = 'new lang set'
lang.EN.enabled = 'enabled'
lang.EN.disabled = 'disabled'
lang.EN.prof = 'Evaluating world data...'
lang.EN.notData = 'No stored data found'


/* Español: ES */
lang.ES.invalidCommand = 'Comando inválido'
lang.ES.invalidValue = 'Valor inválido'
lang.ES.invalidLang = 'Lenguaje inválido'
lang.ES.invalidAction = 'Acción inválida para repetir'
lang.ES.fakeplayerInvalid = 'Solo puedes manipular jugadores existentes'
lang.ES.fakeplayerConnected = 'ya esta conectado'
lang.ES.newLang = 'nuevo lenguaje establecido'
lang.ES.enabled = 'habilitado'
lang.ES.disabled = 'deshabilitado'
lang.ES.prof = 'Evaluando datos del mundo...'
lang.ES.notData = 'No se encontraron datos almacenados'


/* Português: PT */
lang.PT.invalidCommand = 'Comando inválido'
lang.PT.invalidValue = 'Valor inválido'
lang.PT.invalidLang = 'Língua inválida'
lang.PT.invalidAction = 'Ação inválida para repetir'
lang.PT.fakeplayerInvalid = 'Você só pode manipular jogadores existentes'
lang.PT.fakeplayerConnected = 'já está conectado'
lang.PT.newLang = 'nova língua definida'
lang.PT.enabled = 'ativado'
lang.PT.disabled = 'desativado'
lang.PT.prof = 'Avaliando dados do mundo...'
lang.PT.notData = 'Não sei se encontraram dados armazenados'


/* 中国人: ZH */
lang.ZH.invalidCommand = '无效命令'
lang.ZH.invalidValue = '无效值'
lang.ZH.invalidLang = '无效语言'
lang.ZH.invalidAction = '无效的重复操作'
lang.ZH.fakeplayerInvalid = '您只能操作现有玩家'
lang.ZH.fakeplayerConnected = '已连接'
lang.ZH.newLang = '新语言设置'
lang.ZH.enabled = '已启用'
lang.ZH.disabled = '已禁用'
lang.ZH.prof = '评估世界数据...'
lang.ZH.notData = '未找到存储的数据'


/* 日本語: JA */
lang.JA.invalidCommand = '無効なコマンド'
lang.JA.invalidValue = '無効な値'
lang.JA.invalidLang = '無効な言語'
lang.JA.invalidAction = '繰り返すための無効なアクション'
lang.JA.fakeplayerInvalid = '既存のプレイヤーのみ操作できます'
lang.JA.fakeplayerConnected = '接続されています'
lang.JA.newLang = '新しい言語が設定されました'
lang.JA.enabled = '有効'
lang.JA.disabled = '無効'
lang.JA.prof = 'ワールドデータを評価中...'
lang.JA.notData = '保存されたデータが見つかりません'


// Exports
module({ LANG: lang });