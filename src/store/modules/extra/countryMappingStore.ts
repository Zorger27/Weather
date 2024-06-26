import { GetterTree } from 'vuex';
interface State {
  countryMapping: { [countryCode: string]: { [language: string]: string } };
}

const state = {
  countryMapping: {
    // страны Европы
    "UA": {"uk": "Україна", "en": "Ukraine", "es": "Ucrania"},
    "DE": {"uk": "Німеччина", "en": "Germany", "es": "Alemania"},
    "FR": {"uk": "Франція", "en": "France", "es": "Francia"},
    "IT": {"uk": "Італія", "en": "Italy", "es": "Italia"},
    "ES": {"uk": "Іспанія", "en": "Spain", "es": "España"},
    "GB": {"uk": "Велика Британія", "en": "United Kingdom", "es": "Reino Unido"},
    "RU": {"uk": "Росія", "en": "Russia", "es": "Rusia"},
    "SE": {"uk": "Швеція", "en": "Sweden", "es": "Suecia"},
    "CH": {"uk": "Швейцарія", "en": "Switzerland", "es": "Suiza"},
    "PL": {"uk": "Польща", "en": "Poland", "es": "Polonia"},
    "HU": {"uk": "Угорщина", "en": "Hungary", "es": "Hungría"},
    "CZ": {"uk": "Чехія", "en": "Czech Republic", "es": "República Checa"},
    "LV": {"uk": "Латвія", "en": "Latvia", "es": "Letonia"},
    "LT": {"uk": "Литва", "en": "Lithuania", "es": "Lituania"},
    "EE": {"uk": "Естонія", "en": "Estonia", "es": "Estonia"},
    "NO": {"uk": "Норвегія", "en": "Norway", "es": "Noruega"},
    "FI": {"uk": "Фінляндія", "en": "Finland", "es": "Finlandia"},
    "DK": {"uk": "Данія", "en": "Denmark", "es": "Dinamarca"},
    "IS": {"uk": "Ісландія", "en": "Iceland", "es": "Islandia"},
    "IE": {"uk": "Ірландія", "en": "Ireland", "es": "Irlanda"},
    "PT": {"uk": "Португалія", "en": "Portugal", "es": "Portugal"},
    "BE": {"uk": "Бельгія", "en": "Belgium", "es": "Bélgica"},
    "NL": {"uk": "Нідерланди", "en": "Netherlands", "es": "Países Bajos"},
    "AT": {"uk": "Австрія", "en": "Austria", "es": "Austria"},
    "GR": {"uk": "Греція", "en": "Greece", "es": "Grecia"},
    "RO": {"uk": "Румунія", "en": "Romania", "es": "Rumania"},
    "BG": {"uk": "Болгарія", "en": "Bulgaria", "es": "Bulgaria"},
    "HR": {"uk": "Хорватія", "en": "Croatia", "es": "Croacia"},
    "RS": {"uk": "Сербія", "en": "Serbia", "es": "Serbia"},
    "SI": {"uk": "Словенія", "en": "Slovenia", "es": "Eslovenia"},
    "BA": {"uk": "Боснія і Герцеговина", "en": "Bosnia and Herzegovina", "es": "Bosnia y Herzegovina"},
    "MK": {"uk": "Північна Македонія", "en": "North Macedonia", "es": "Macedonia del Norte"},
    "ME": {"uk": "Чорногорія", "en": "Montenegro", "es": "Montenegro"},
    "XK": {"uk": "Косово", "en": "Kosovo", "es": "Kosovo"},
    "AL": {"uk": "Албанія", "en": "Albania", "es": "Albania"},
    "CY": {"uk": "Кіпр", "en": "Cyprus", "es": "Chipre"},
    "MT": {"uk": "Мальта", "en": "Malta", "es": "Malta"},
    // страны Азии
    "CN": {"uk": "Китай", "en": "China", "es": "China"},
    "JP": {"uk": "Японія", "en": "Japan", "es": "Japón"},
    "IN": {"uk": "Індія", "en": "India", "es": "India"},
    "KR": {"uk": "Південна Корея", "en": "South Korea", "es": "Corea del Sur"},
    "TH": {"uk": "Таїланд", "en": "Thailand", "es": "Tailandia"},
    "MY": {"uk": "Малайзія", "en": "Malaysia", "es": "Malasia"},
    "SG": {"uk": "Сінгапур", "en": "Singapore", "es": "Singapur"},
    "ID": {"uk": "Індонезія", "en": "Indonesia", "es": "Indonesia"},
    "PH": {"uk": "Філіппіни", "en": "Philippines", "es": "Filipinas"},
    "VN": {"uk": "В'єтнам", "en": "Vietnam", "es": "Vietnam"},
    "TR": {"uk": "Туреччина", "en": "Turkey", "es": "Turquía"},
    "AE": {"uk": "Об'єднані Арабські Емірати", "en": "United Arab Emirates", "es": "Emiratos Árabes Unidos"},
    "SA": {"uk": "Саудівська Аравія", "en": "Saudi Arabia", "es": "Arabia Saudita"},
    "IQ": {"uk": "Ірак", "en": "Iraq", "es": "Irak"},
    "IR": {"uk": "Іран", "en": "Iran", "es": "Irán"},
    "SY": {"uk": "Сирія", "en": "Syria", "es": "Siria"},
    "AM": {"uk": "Вірменія", "en": "Armenia", "es": "Armenia"},
    "GE": {"uk": "Грузія", "en": "Georgia", "es": "Georgia"},
    "AZ": {"uk": "Азербайджан", "en": "Azerbaijan", "es": "Azerbaiyán"},
    "UZ": {"uk": "Узбекистан", "en": "Uzbekistan", "es": "Uzbekistán"},
    "KZ": {"uk": "Казахстан", "en": "Kazakhstan", "es": "Kazajistán"},
    "TM": {"uk": "Туркменістан", "en": "Turkmenistan", "es": "Turkmenistán"},
    "KG": {"uk": "Киргизстан", "en": "Kyrgyzstan", "es": "Kirguistán"},
    "TJ": {"uk": "Таджикистан", "en": "Tajikistan", "es": "Tayikistán"},
    "AF": {"uk": "Афганістан", "en": "Afghanistan", "es": "Afganistán"},
    "NP": {"uk": "Непал", "en": "Nepal", "es": "Nepal"},
    "BT": {"uk": "Бутан", "en": "Bhutan", "es": "Bután"},
    "BD": {"uk": "Бангладеш", "en": "Bangladesh", "es": "Bangladés"},
    "LK": {"uk": "Шрі-Ланка", "en": "Sri Lanka", "es": "Sri Lanka"},
    "MV": {"uk": "Мальдіви", "en": "Maldives", "es": "Maldivas"},
    // страны Африки
    "NG": {"uk": "Нігерія", "en": "Nigeria", "es": "Nigeria"},
    "EG": {"uk": "Єгипет", "en": "Egypt", "es": "Egipto"},
    "ZA": {"uk": "Південна Африка", "en": "South Africa", "es": "Sudáfrica"},
    "KE": {"uk": "Кенія", "en": "Kenya", "es": "Kenia"},
    "ET": {"uk": "Ефіопія", "en": "Ethiopia", "es": "Etiopía"},
    "GH": {"uk": "Гана", "en": "Ghana", "es": "Ghana"},
    "SD": {"uk": "Судан", "en": "Sudan", "es": "Sudán"},
    "MZ": {"uk": "Мозамбік", "en": "Mozambique", "es": "Mozambique"},
    "CM": {"uk": "Камерун", "en": "Cameroon", "es": "Camerún"},
    "CI": {"uk": "Кот-д'Івуар", "en": "Côte d'Ivoire", "es": "Costa de Marfil"},
    "CF": {"uk": "Центральноафриканська Республіка", "en": "Central African Republic", "es": "República Centroafricana"},
    "CD": {"uk": "Демократична Республіка Конго", "en": "Democratic Republic of the Congo", "es": "República Democrática del Congo"},
    "ZW": {"uk": "Зімбабве", "en": "Zimbabwe", "es": "Zimbabue"},
    "UG": {"uk": "Уганда", "en": "Uganda", "es": "Uganda"},
    "SN": {"uk": "Сенегал", "en": "Senegal", "es": "Senegal"},
    // страны Северной Америки
    "US": {"uk": "Сполучені Штати", "en": "United States", "es": "Estados Unidos"},
    "CA": {"uk": "Канада", "en": "Canada", "es": "Canadá"},
    "MX": {"uk": "Мексика", "en": "Mexico", "es": "México"},
    "GT": {"uk": "Гватемала", "en": "Guatemala", "es": "Guatemala"},
    "CR": {"uk": "Коста-Рика", "en": "Costa Rica", "es": "Costa Rica"},
    "PA": {"uk": "Панама", "en": "Panama", "es": "Panamá"},
    "BZ": {"uk": "Беліз", "en": "Belize", "es": "Belice"},
    "SV": {"uk": "Сальвадор", "en": "El Salvador", "es": "El Salvador"},
    "HN": {"uk": "Гондурас", "en": "Honduras", "es": "Honduras"},
    "NI": {"uk": "Нікарагуа", "en": "Nicaragua", "es": "Nicaragua"},
    // страны Южной Америки
    "AR": {"uk": "Аргентина", "en": "Argentina", "es": "Argentina"},
    "BR": {"uk": "Бразилія", "en": "Brazil", "es": "Brasil"},
    "CL": {"uk": "Чилі", "en": "Chile", "es": "Chile"},
    "CO": {"uk": "Колумбія", "en": "Colombia", "es": "Colombia"},
    "PE": {"uk": "Перу", "en": "Peru", "es": "Perú"},
    "VE": {"uk": "Венесуела", "en": "Venezuela", "es": "Venezuela"},
    "EC": {"uk": "Еквадор", "en": "Ecuador", "es": "Ecuador"},
    "UY": {"uk": "Уругвай", "en": "Uruguay", "es": "Uruguay"},
    "PY": {"uk": "Парагвай", "en": "Paraguay", "es": "Paraguay"},
    "BO": {"uk": "Болівія", "en": "Bolivia", "es": "Bolivia"},
    "GY": {"uk": "Гайана", "en": "Guyana", "es": "Guyana"},
    "SR": {"uk": "Суринам", "en": "Suriname", "es": "Surinam"},
    "GF": {"uk": "Французька Гвіана", "en": "French Guiana", "es": "Guayana Francesa"},
    "FK": {"uk": "Фолклендські острови", "en": "Falkland Islands", "es": "Islas Malvinas"},
    // страны Латинской Америки
    "CU": {"uk": "Куба", "en": "Cuba", "es": "Cuba"},
    "HT": {"uk": "Гаїті", "en": "Haiti", "es": "Haití"},
    "DO": {"uk": "Домініканська Республіка", "en": "Dominican Republic", "es": "República Dominicana"},
    "JM": {"uk": "Ямайка", "en": "Jamaica", "es": "Jamaica"},
    "TT": {"uk": "Тринідад і Тобаго", "en": "Trinidad and Tobago", "es": "Trinidad y Tobago"},
    "BS": {"uk": "Багамські острови", "en": "Bahamas", "es": "Bahamas"},
    // страны Океании
    "AU": {"uk": "Австралія", "en": "Australia", "es": "Australia"},
    "NZ": {"uk": "Нова Зеландія", "en": "New Zealand", "es": "Nueva Zelanda"},
    "FJ": {"uk": "Фіджі", "en": "Fiji", "es": "Fiyi"},
    "PG": {"uk": "Папуа Нова Гвінея", "en": "Papua New Guinea", "es": "Papúa Nueva Guinea"},
    "SB": {"uk": "Соломонові Острови", "en": "Solomon Islands", "es": "Islas Salomón"},
    "VU": {"uk": "Вануату", "en": "Vanuatu", "es": "Vanuatu"},
    "NC": {"uk": "Нова Каледонія", "en": "New Caledonia", "es": "Nueva Caledonia"},
    "PF": {"uk": "Французька Полінезія", "en": "French Polynesia", "es": "Polinesia Francesa"},
    "WS": {"uk": "Самоа", "en": "Samoa", "es": "Samoa"},
    "KI": {"uk": "Кірибаті", "en": "Kiribati", "es": "Kiribati"},
    "TO": {"uk": "Тонга", "en": "Tonga", "es": "Tonga"},
    "FM": {"uk": "Мікронезія", "en": "Micronesia", "es": "Micronesia"},
    "MH": {"uk": "Маршаллові Острови", "en": "Marshall Islands", "es": "Islas Marshall"},
    "PW": {"uk": "Палау", "en": "Palau", "es": "Palaos"},
    "CK": {"uk": "Острови Кука", "en": "Cook Islands", "es": "Islas Cook"},
  }
};

const getters: GetterTree<State, any> = {
  getCountryName: (state) => (countryCode: string, language: string) => {
    const countryInfo = state.countryMapping[countryCode];
    return countryInfo && countryInfo[language] ? countryInfo[language] : null;
  },
};

const mutations = {};
const actions = {};
export default {
  state,
  getters,
  mutations,
  actions
};