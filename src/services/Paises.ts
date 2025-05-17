// const ImplementacionEnFrontEnd = `
//     import Input from '@/components/dashboard/componentes_generales/formulario/Input';
//     import Paises from '@/services/Paises';
    
//     //Estado Pais
//     const [Pais, setPais] = React.useState<string>('48');
//     const handleChangePais = (event: SelectChangeEvent<string>) => {
//         const newValue = event.target.value;
//         setPais(newValue);
//     };

//     //Dentro del componente que retorna
//     <Grid md={2} xs={12} mt={0.5} style={{display: 'block'}}>
//         <InputSelect
//             label='País'
//             value={Pais}
//             options={Paises}
//             size='small'
//             onChange={handleChangePais}
//             valorname='Pais'
//         />
//     </Grid>
// `;

const Paises = [
    {
        value: 1,
        label: "AFGANISTÁN"
    },
    {
        value: 2,
        label: "ALBANIA"
    },
    {
        value: 3,
        label: "ANTÁRTIDA"
    },
    {
        value: 4,
        label: "ARGELIA"
    },
    {
        value: 5,
        label: "SAMOA AMERICANA"
    },
    {
        value: 6,
        label: "ANDORRA"
    },
    {
        value: 7,
        label: "ANGOLA"
    },
    {
        value: 8,
        label: "ANTIGUA Y BARBUDA"
    },
    {
        value: 9,
        label: "AZERBAIYÁN"
    },
    {
        value: 10,
        label: "ARGENTINA"
    },
    {
        value: 11,
        label: "AUSTRALIA"
    },
    {
        value: 12,
        label: "AUSTRIA"
    },
    {
        value: 13,
        label: "BAHAMAS"
    },
    {
        value: 14,
        label: "BARÉIN"
    },
    {
        value: 15,
        label: "BANGLADÉS"
    },
    {
        value: 16,
        label: "ARMENIA"
    },
    {
        value: 17,
        label: "BARBADOS"
    },
    {
        value: 18,
        label: "BÉLGICA"
    },
    {
        value: 19,
        label: "BERMUDA"
    },
    {
        value: 20,
        label: "BUTÁN"
    },
    {
        value: 21,
        label: "BOLIVIA"
    },
    {
        value: 22,
        label: "BOSNIA-HERZEGOVINA"
    },
    {
        value: 23,
        label: "BOTSUANA"
    },
    {
        value: 24,
        label: "ISLA BOUVET"
    },
    {
        value: 25,
        label: "BRAZIL"
    },
    {
        value: 26,
        label: "BELICE"
    },
    {
        value: 27,
        label: "TERRITORIO BRITÁNICO DEL OCÉANO ÍNDICO"
    },
    {
        value: 28,
        label: "ISLAS SOLOMON"
    },
    {
        value: 29,
        label: "ISLAS VÍRGENES BRITÁNICAS"
    },
    {
        value: 30,
        label: "BRUNÉI"
    },
    {
        value: 31,
        label: "BULGARIA"
    },
    {
        value: 32,
        label: "MYANMAR (FORMER BURMA)"
    },
    {
        value: 33,
        label: "BURUNDI"
    },
    {
        value: 34,
        label: "BIELORRUSIA"
    },
    {
        value: 35,
        label: "CAMBOYA"
    },
    {
        value: 36,
        label: "CAMERÚN"
    },
    {
        value: 37,
        label: "CANADÁ"
    },
    {
        value: 38,
        label: "CABO VERDE"
    },
    {
        value: 39,
        label: "ISLAS CAIMÁN"
    },
    {
        value: 40,
        label: "REPÚBLICA CENTROAFRICANA"
    },
    {
        value: 41,
        label: "SRI LANKA"
    },
    {
        value: 42,
        label: "CHAD"
    },
    {
        value: 43,
        label: "CHILE"
    },
    {
        value: 44,
        label: "CHINA"
    },
    {
        value: 45,
        label: "TAIWAN"
    },
    {
        value: 46,
        label: "ISLA DE NAVIDAD"
    },
    {
        value: 47,
        label: "ISLAS COCOS"
    },
    {
        value: 48,
        label: "COLOMBIA"
    },
    {
        value: 49,
        label: "COMORAS"
    },
    {
        value: 50,
        label: "MAYOTTE"
    },
    {
        value: 51,
        label: "CONGO"
    },
    {
        value: 52,
        label: "REPÚBLICA DEMOCRÁTICA DEL CONGO"
    },
    {
        value: 53,
        label: "ISLAS COOK"
    },
    {
        value: 54,
        label: "COSTA RICA"
    },
    {
        value: 55,
        label: "CROACIA"
    },
    {
        value: 56,
        label: "CUBA"
    },
    {
        value: 57,
        label: "CHIPRE"
    },
    {
        value: 58,
        label: "REPÚBLICA CHECA"
    },
    {
        value: 59,
        label: "BENIN"
    },
    {
        value: 60,
        label: "DINAMARCA"
    },
    {
        value: 61,
        label: "DOMINICA"
    },
    {
        value: 62,
        label: "REPÚBLICA DOMINICANA"
    },
    {
        value: 63,
        label: "ECUADOR"
    },
    {
        value: 64,
        label: "EL SALVADOR"
    },
    {
        value: 65,
        label: "GUINEA ECUATORIAL"
    },
    {
        value: 66,
        label: "ETIOPIA"
    },
    {
        value: 67,
        label: "ERITREA"
    },
    {
        value: 68,
        label: "ESTONIA"
    },
    {
        value: 69,
        label: "ISLAS FEROE"
    },
    {
        value: 70,
        label: "ISLAS MALVINAS"
    },
    {
        value: 71,
        label: "ISLAS GEORGIAS DEL SUR Y SANDWICH DEL SUR"
    },
    {
        value: 72,
        label: "FIYI"
    },
    {
        value: 73,
        label: "FINLANDIA"
    },
    {
        value: 74,
        label: "ALAND"
    },
    {
        value: 75,
        label: "FRANCIA"
    },
    {
        value: 76,
        label: "GUAYANA FRANCESA"
    },
    {
        value: 77,
        label: "POLINESIA FRANCESA"
    },
    {
        value: 78,
        label: "TIERRAS AUSTRALES Y ANTÁRTICAS FRANCESAS"
    },
    {
        value: 79,
        label: "YIBUTI"
    },
    {
        value: 80,
        label: "GABON"
    },
    {
        value: 81,
        label: "GEORGIA"
    },
    {
        value: 82,
        label: "GAMBIA"
    },
    {
        value: 83,
        label: "PALESTINA"
    },
    {
        value: 84,
        label: "ALEMANIA"
    },
    {
        value: 85,
        label: "GHANA"
    },
    {
        value: 86,
        label: "GIBRALTAR"
    },
    {
        value: 87,
        label: "KIRIBATI"
    },
    {
        value: 88,
        label: "GRECIA"
    },
    {
        value: 89,
        label: "GROENLANDIA"
    },
    {
        value: 90,
        label: "GRANADA"
    },
    {
        value: 91,
        label: "GUADALUOE"
    },
    {
        value: 92,
        label: "GUAM"
    },
    {
        value: 93,
        label: "GUATEMALA"
    },
    {
        value: 94,
        label: "GUINEA"
    },
    {
        value: 95,
        label: "GUYANA"
    },
    {
        value: 96,
        label: "HAITI"
    },
    {
        value: 97,
        label: "ISLA HEARD Y MCDONALD"
    },
    {
        value: 98,
        label: "SANTA SEDE"
    },
    {
        value: 99,
        label: "HONDURAS"
    },
    {
        value: 100,
        label: "HONG KONG"
    },
    {
        value: 101,
        label: "HUNGRÍA"
    },
    {
        value: 102,
        label: "ISLANDIA"
    },
    {
        value: 103,
        label: "INDIA"
    },
    {
        value: 104,
        label: "INDONESIA"
    },
    {
        value: 105,
        label: "IRÁN"
    },
    {
        value: 106,
        label: "IRAQ"
    },
    {
        value: 107,
        label: "IRLANDA"
    },
    {
        value: 108,
        label: "ISRAEL"
    },
    {
        value: 109,
        label: "ITALIA"
    },
    {
        value: 110,
        label: "COSTA DE MARFIL"
    },
    {
        value: 111,
        label: "JAMAICA"
    },
    {
        value: 112,
        label: "JAPÓN"
    },
    {
        value: 113,
        label: "KAZAJISTÁN"
    },
    {
        value: 114,
        label: "JORDANIA"
    },
    {
        value: 115,
        label: "KENYA"
    },
    {
        value: 116,
        label: "COREA DEL NORTE"
    },
    {
        value: 117,
        label: "COREA DEL SUR"
    },
    {
        value: 118,
        label: "KUWAIT"
    },
    {
        value: 119,
        label: "KIRGUISTÁN"
    },
    {
        value: 120,
        label: "LAOS"
    },
    {
        value: 121,
        label: "LÍBANO"
    },
    {
        value: 122,
        label: "LESOTO"
    },
    {
        value: 123,
        label: "LETONIA"
    },
    {
        value: 124,
        label: "LIBERIA"
    },
    {
        value: 125,
        label: "LIBIA"
    },
    {
        value: 126,
        label: "LIECHTENSTEIN"
    },
    {
        value: 127,
        label: "LITUANIA"
    },
    {
        value: 128,
        label: "LUXEMBURGO"
    },
    {
        value: 129,
        label: "MACAO"
    },
    {
        value: 130,
        label: "MADAGASCAR"
    },
    {
        value: 131,
        label: "MALAUI"
    },
    {
        value: 132,
        label: "MALASIA"
    },
    {
        value: 133,
        label: "MALDIVAS"
    },
    {
        value: 134,
        label: "MALI"
    },
    {
        value: 135,
        label: "MALTA"
    },
    {
        value: 136,
        label: "MARTINICA"
    },
    {
        value: 137,
        label: "MAURITANIA"
    },
    {
        value: 138,
        label: "MAURICIO"
    },
    {
        value: 139,
        label: "MÉXICO"
    },
    {
        value: 140,
        label: "MÓNACO"
    },
    {
        value: 141,
        label: "MONGOLIA"
    },
    {
        value: 142,
        label: "MOLDAVIA"
    },
    {
        value: 143,
        label: "MONTENEGRO"
    },
    {
        value: 144,
        label: "MONTSERRAT"
    },
    {
        value: 145,
        label: "MARRUECOS"
    },
    {
        value: 146,
        label: "MOZAMBIQUE"
    },
    {
        value: 147,
        label: "OMÁN"
    },
    {
        value: 148,
        label: "NAMIBIA"
    },
    {
        value: 149,
        label: "NAURU"
    },
    {
        value: 150,
        label: "NEPAL"
    },
    {
        value: 151,
        label: "PAÍSES BAJOS"
    },
    {
        value: 152,
        label: "CURAZAO"
    },
    {
        value: 153,
        label: "ARUBA"
    },
    {
        value: 154,
        label: "SAN MARTÍN (parte holandesa)"
    },
    {
        value: 155,
        label: "BONAIRE, SAN EUSTAQUIO Y SABA"
    },
    {
        value: 156,
        label: "NUEVA CALEDONIA"
    },
    {
        value: 157,
        label: "VANUATU"
    },
    {
        value: 158,
        label: "NUEVA ZELANDA"
    },
    {
        value: 159,
        label: "NICARAGUA"
    },
    {
        value: 160,
        label: "NIGER"
    },
    {
        value: 161,
        label: "NIGERIA"
    },
    {
        value: 162,
        label: "NIUE"
    },
    {
        value: 163,
        label: "ISLA NORFOLK"
    },
    {
        value: 164,
        label: "NORUEGA"
    },
    {
        value: 165,
        label: "ISLAS MARIANAS DEL NORTE"
    },
    {
        value: 166,
        label: "ISLAS ULTRAMARINAS MENORES DE ESTADOS UNIDOS"
    },
    {
        value: 167,
        label: "MICRONESIA"
    },
    {
        value: 168,
        label: "ISLAS MARSHALL"
    },
    {
        value: 169,
        label: "PALAOS"
    },
    {
        value: 170,
        label: "PAQUISTAN"
    },
    {
        value: 171,
        label: "PANAMÁ"
    },
    {
        value: 172,
        label: "PAPUA NUEVA GUINEA"
    },
    {
        value: 173,
        label: "PARAGUAY"
    },
    {
        value: 174,
        label: "PERÚ"
    },
    {
        value: 175,
        label: "FILIPINAS"
    },
    {
        value: 176,
        label: "PITCAIRN"
    },
    {
        value: 177,
        label: "POLONIA"
    },
    {
        value: 178,
        label: "PORTUGAL"
    },
    {
        value: 179,
        label: "GUINEA-BISÁU"
    },
    {
        value: 180,
        label: "TIMOR ORIENTAL"
    },
    {
        value: 181,
        label: "PUERTO RICO"
    },
    {
        value: 182,
        label: "CATAR"
    },
    {
        value: 183,
        label: "REUNION"
    },
    {
        value: 184,
        label: "RUMANIA"
    },
    {
        value: 185,
        label: "RUSIA"
    },
    {
        value: 186,
        label: "RUANDA"
    },
    {
        value: 187,
        label: "SAN BARTOLOMÉ"
    },
    {
        value: 188,
        label: "SANTA HELENA, ASCENSIÓN Y TRISTÁN DE ACUÑA"
    },
    {
        value: 189,
        label: "SAN CRISTÓBAL Y NIEVES"
    },
    {
        value: 190,
        label: "ANGUILA"
    },
    {
        value: 191,
        label: "SANTA LUCIA"
    },
    {
        value: 192,
        label: "SAN MARTÍN (parte francesa)"
    },
    {
        value: 193,
        label: "SAN PEDRO Y MIQUELON"
    },
    {
        value: 194,
        label: "SAN VICENTE Y LAS GRANADINAS"
    },
    {
        value: 195,
        label: "SAN MARINO"
    },
    {
        value: 196,
        label: "SANTO TOME Y PRINCIPE"
    },
    {
        value: 197,
        label: "ARABIA SAUDITA"
    },
    {
        value: 198,
        label: "SENEGAL"
    },
    {
        value: 199,
        label: "SERBIA"
    },
    {
        value: 200,
        label: "SEYCHELLES"
    },
    {
        value: 201,
        label: "SIERRA LEONA"
    },
    {
        value: 202,
        label: "SINGAPUR"
    },
    {
        value: 203,
        label: "ESLOVAQUIA"
    },
    {
        value: 204,
        label: "VIETNAM"
    },
    {
        value: 205,
        label: "ESLOVENIA"
    },
    {
        value: 206,
        label: "SOMALIA"
    },
    {
        value: 207,
        label: "SUDÁFRICA"
    },
    {
        value: 208,
        label: "ZIMBABUE"
    },
    {
        value: 209,
        label: "ESPAÑA"
    },
    {
        value: 210,
        label: "SUDÁN DEL SUR"
    },
    {
        value: 211,
        label: "SUDÁN"
    },
    {
        value: 212,
        label: "SAHARA OCCIDENTAL"
    },
    {
        value: 213,
        label: "SURINAM"
    },
    {
        value: 214,
        label: "SVALBARD Y JAN MAYEN"
    },
    {
        value: 215,
        label: "SUAZILANDIA"
    },
    {
        value: 216,
        label: "SUECIA"
    },
    {
        value: 217,
        label: "SUIZA"
    },
    {
        value: 218,
        label: "SIRIA"
    },
    {
        value: 219,
        label: "TAYIKISTÁN"
    },
    {
        value: 220,
        label: "TAILANDIA"
    },
    {
        value: 221,
        label: "TOGO"
    },
    {
        value: 222,
        label: "TOKELAU"
    },
    {
        value: 223,
        label: "TONGA"
    },
    {
        value: 224,
        label: "TRINIDAD Y TOBAGO"
    },
    {
        value: 225,
        label: "EMIRATOS ÁRABES UNIDOS"
    },
    {
        value: 226,
        label: "TÚNEZ"
    },
    {
        value: 227,
        label: "TURQUÍA"
    },
    {
        value: 228,
        label: "TURKMENISTAN"
    },
    {
        value: 229,
        label: "ISLAS TURCAS Y CAICOS"
    },
    {
        value: 230,
        label: "TUVALU"
    },
    {
        value: 231,
        label: "UGANDA"
    },
    {
        value: 232,
        label: "UCRANIA"
    },
    {
        value: 233,
        label: "MACEDONIA"
    },
    {
        value: 234,
        label: "EGIPTO"
    },
    {
        value: 235,
        label: "REINO UNIDO"
    },
    {
        value: 236,
        label: "GUERNSEY"
    },
    {
        value: 237,
        label: "JERSEY"
    },
    {
        value: 238,
        label: "ISLA DE MAN"
    },
    {
        value: 239,
        label: "TANZANIA"
    },
    {
        value: 240,
        label: "ESTADOS UNIDOS"
    },
    {
        value: 241,
        label: "ISLAS VÍRGENES DE LOS ESTADOS UNIDOS"
    },
    {
        value: 242,
        label: "BURKINA FASO"
    },
    {
        value: 243,
        label: "URUGUAY"
    },
    {
        value: 244,
        label: "UZBEKISTAN"
    },
    {
        value: 245,
        label: "VENEZUELA"
    },
    {
        value: 246,
        label: "WALLIS Y FUTUNA"
    },
    {
        value: 247,
        label: "SAMOA"
    },
    {
        value: 248,
        label: "YEMEN"
    },
    {
        value: 249,
        label: "ZAMBIA"
    }
];



export default Paises;