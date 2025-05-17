// const ImplementacionEnFrontEnd = `
//     import Input from '@/components/dashboard/componentes_generales/formulario/Input';
//     import Ciudades from '@/services/Municipios';

//     //Estado Municipio
//     const [Ciudad, setCiudad] = React.useState<string>('1');
//     const handleChangeCiudad = (event: SelectChangeEvent<string>) => {
//         const newValue = event.target.value;
//         setCiudad(newValue);
//     };

//     //Dentro del componente que retorna
//     <Grid md={2} xs={12} mt={0.5}>
//         <InputSelect
//             label='Ciudad'
//             value={Ciudad}
//             options={Ciudades}
//             size='small'
//             onChange={handleChangeCiudad}
//         />
//     </Grid>
// `;

const Ciudades = [
    {
        "value": 1,
        "label": "MEDELLÍN"
    },
    {
        "value": 2,
        "label": "ABEJORRAL"
    },
    {
        "value": 3,
        "label": "ABRIAQUÍ"
    },
    {
        "value": 4,
        "label": "ALEJANDRÍA"
    },
    {
        "value": 5,
        "label": "AMAGÁ"
    },
    {
        "value": 6,
        "label": "AMALFI"
    },
    {
        "value": 7,
        "label": "ANDES"
    },
    {
        "value": 8,
        "label": "ANGELÓPOLIS"
    },
    {
        "value": 9,
        "label": "ANGOSTURA"
    },
    {
        "value": 10,
        "label": "ANORÍ"
    },
    {
        "value": 11,
        "label": "SANTA FÉ DE ANTIOQUIA"
    },
    {
        "value": 12,
        "label": "ANZÁ"
    },
    {
        "value": 13,
        "label": "APARTADÓ"
    },
    {
        "value": 14,
        "label": "ARBOLETES"
    },
    {
        "value": 15,
        "label": "ARGELIA"
    },
    {
        "value": 16,
        "label": "ARMENIA"
    },
    {
        "value": 17,
        "label": "BARBOSA"
    },
    {
        "value": 18,
        "label": "BELMIRA"
    },
    {
        "value": 19,
        "label": "BELLO"
    },
    {
        "value": 20,
        "label": "BETANIA"
    },
    {
        "value": 21,
        "label": "BETULIA"
    },
    {
        "value": 22,
        "label": "CIUDAD BOLÍVAR"
    },
    {
        "value": 23,
        "label": "BRICEÑO"
    },
    {
        "value": 24,
        "label": "BURITICÁ"
    },
    {
        "value": 25,
        "label": "CÁCERES"
    },
    {
        "value": 26,
        "label": "CAICEDO"
    },
    {
        "value": 27,
        "label": "CALDAS"
    },
    {
        "value": 28,
        "label": "CAMPAMENTO"
    },
    {
        "value": 29,
        "label": "CAÑASGORDAS"
    },
    {
        "value": 30,
        "label": "CARACOLÍ"
    },
    {
        "value": 31,
        "label": "CARAMANTA"
    },
    {
        "value": 32,
        "label": "CAREPA"
    },
    {
        "value": 33,
        "label": "EL CARMEN DE VIBORAL"
    },
    {
        "value": 34,
        "label": "CAROLINA"
    },
    {
        "value": 35,
        "label": "CAUCASIA"
    },
    {
        "value": 36,
        "label": "CHIGORODÓ"
    },
    {
        "value": 37,
        "label": "CISNEROS"
    },
    {
        "value": 38,
        "label": "COCORNÁ"
    },
    {
        "value": 39,
        "label": "CONCEPCIÓN"
    },
    {
        "value": 40,
        "label": "CONCORDIA"
    },
    {
        "value": 41,
        "label": "COPACABANA"
    },
    {
        "value": 42,
        "label": "DABEIBA"
    },
    {
        "value": 43,
        "label": "DONMATÍAS"
    },
    {
        "value": 44,
        "label": "EBÉJICO"
    },
    {
        "value": 45,
        "label": "EL BAGRE"
    },
    {
        "value": 46,
        "label": "ENTRERRÍOS"
    },
    {
        "value": 47,
        "label": "ENVIGADO"
    },
    {
        "value": 48,
        "label": "FREDONIA"
    },
    {
        "value": 49,
        "label": "FRONTINO"
    },
    {
        "value": 50,
        "label": "GIRALDO"
    },
    {
        "value": 51,
        "label": "GIRARDOTA"
    },
    {
        "value": 52,
        "label": "GÓMEZ PLATA"
    },
    {
        "value": 53,
        "label": "GRANADA"
    },
    {
        "value": 54,
        "label": "GUADALUPE"
    },
    {
        "value": 55,
        "label": "GUARNE"
    },
    {
        "value": 56,
        "label": "GUATAPÉ"
    },
    {
        "value": 57,
        "label": "HELICONIA"
    },
    {
        "value": 58,
        "label": "HISPANIA"
    },
    {
        "value": 59,
        "label": "ITAGÜÍ"
    },
    {
        "value": 60,
        "label": "ITUANGO"
    },
    {
        "value": 61,
        "label": "JARDÍN"
    },
    {
        "value": 62,
        "label": "JERICÓ"
    },
    {
        "value": 63,
        "label": "LA CEJA"
    },
    {
        "value": 64,
        "label": "LA ESTRELLA"
    },
    {
        "value": 65,
        "label": "LA PINTADA"
    },
    {
        "value": 66,
        "label": "LA UNIÓN"
    },
    {
        "value": 67,
        "label": "LIBORINA"
    },
    {
        "value": 68,
        "label": "MACEO"
    },
    {
        "value": 69,
        "label": "MARINILLA"
    },
    {
        "value": 70,
        "label": "MONTEBELLO"
    },
    {
        "value": 71,
        "label": "MURINDÓ"
    },
    {
        "value": 72,
        "label": "MUTATÁ"
    },
    {
        "value": 73,
        "label": "NARIÑO"
    },
    {
        "value": 74,
        "label": "NECOCLÍ"
    },
    {
        "value": 75,
        "label": "NECHÍ"
    },
    {
        "value": 76,
        "label": "OLAYA"
    },
    {
        "value": 77,
        "label": "PEÑOL"
    },
    {
        "value": 78,
        "label": "PEQUE"
    },
    {
        "value": 79,
        "label": "PUEBLORRICO"
    },
    {
        "value": 80,
        "label": "PUERTO BERRÍO"
    },
    {
        "value": 81,
        "label": "PUERTO NARE"
    },
    {
        "value": 82,
        "label": "PUERTO TRIUNFO"
    },
    {
        "value": 83,
        "label": "REMEDIOS"
    },
    {
        "value": 84,
        "label": "RETIRO"
    },
    {
        "value": 85,
        "label": "RIONEGRO"
    },
    {
        "value": 86,
        "label": "SABANALARGA"
    },
    {
        "value": 87,
        "label": "SABANETA"
    },
    {
        "value": 88,
        "label": "SALGAR"
    },
    {
        "value": 89,
        "label": "SAN ANDRÉS DE CUERQUÍA"
    },
    {
        "value": 90,
        "label": "SAN CARLOS"
    },
    {
        "value": 91,
        "label": "SAN FRANCISCO"
    },
    {
        "value": 92,
        "label": "SAN JERÓNIMO"
    },
    {
        "value": 93,
        "label": "SAN JOSÉ DE LA MONTAÑA"
    },
    {
        "value": 94,
        "label": "SAN JUAN DE URABÁ"
    },
    {
        "value": 95,
        "label": "SAN LUIS"
    },
    {
        "value": 96,
        "label": "SAN PEDRO DE LOS MILAGROS"
    },
    {
        "value": 97,
        "label": "SAN PEDRO DE URABÁ"
    },
    {
        "value": 98,
        "label": "SAN RAFAEL"
    },
    {
        "value": 99,
        "label": "SAN ROQUE"
    },
    {
        "value": 100,
        "label": "SAN VICENTE FERRER"
    },
    {
        "value": 101,
        "label": "SANTA BÁRBARA"
    },
    {
        "value": 102,
        "label": "SANTA ROSA DE OSOS"
    },
    {
        "value": 103,
        "label": "SANTO DOMINGO"
    },
    {
        "value": 104,
        "label": "EL SANTUARIO"
    },
    {
        "value": 105,
        "label": "SEGOVIA"
    },
    {
        "value": 106,
        "label": "SONSÓN"
    },
    {
        "value": 107,
        "label": "SOPETRÁN"
    },
    {
        "value": 108,
        "label": "TÁMESIS"
    },
    {
        "value": 109,
        "label": "TARAZÁ"
    },
    {
        "value": 110,
        "label": "TARSO"
    },
    {
        "value": 111,
        "label": "TITIRIBÍ"
    },
    {
        "value": 112,
        "label": "TOLEDO"
    },
    {
        "value": 113,
        "label": "TURBO"
    },
    {
        "value": 114,
        "label": "URAMITA"
    },
    {
        "value": 115,
        "label": "URRAO"
    },
    {
        "value": 116,
        "label": "VALDIVIA"
    },
    {
        "value": 117,
        "label": "VALPARAÍSO"
    },
    {
        "value": 118,
        "label": "VEGACHÍ"
    },
    {
        "value": 119,
        "label": "VENECIA"
    },
    {
        "value": 120,
        "label": "VIGÍA DEL FUERTE"
    },
    {
        "value": 121,
        "label": "YALÍ"
    },
    {
        "value": 122,
        "label": "YARUMAL"
    },
    {
        "value": 123,
        "label": "YOLOMBÓ"
    },
    {
        "value": 124,
        "label": "YONDÓ"
    },
    {
        "value": 125,
        "label": "ZARAGOZA"
    },
    {
        "value": 126,
        "label": "BARRANQUILLA"
    },
    {
        "value": 127,
        "label": "BARANOA"
    },
    {
        "value": 128,
        "label": "CAMPO DE LA CRUZ"
    },
    {
        "value": 129,
        "label": "CANDELARIA"
    },
    {
        "value": 130,
        "label": "GALAPA"
    },
    {
        "value": 131,
        "label": "JUAN DE ACOSTA"
    },
    {
        "value": 132,
        "label": "LURUACO"
    },
    {
        "value": 133,
        "label": "MALAMBO"
    },
    {
        "value": 134,
        "label": "MANATÍ"
    },
    {
        "value": 135,
        "label": "PALMAR DE VARELA"
    },
    {
        "value": 136,
        "label": "PIOJÓ"
    },
    {
        "value": 137,
        "label": "POLONUEVO"
    },
    {
        "value": 138,
        "label": "PONEDERA"
    },
    {
        "value": 139,
        "label": "PUERTO COLOMBIA"
    },
    {
        "value": 140,
        "label": "REPELÓN"
    },
    {
        "value": 141,
        "label": "SABANAGRANDE"
    },
    {
        "value": 142,
        "label": "SABANALARGA"
    },
    {
        "value": 143,
        "label": "SANTA LUCÍA"
    },
    {
        "value": 144,
        "label": "SANTO TOMÁS"
    },
    {
        "value": 145,
        "label": "SOLEDAD"
    },
    {
        "value": 146,
        "label": "SUAN"
    },
    {
        "value": 147,
        "label": "TUBARÁ"
    },
    {
        "value": 148,
        "label": "USIACURÍ"
    },
    {
        "value": 149,
        "label": "BOGOTÁ, D.C."
    },
    {
        "value": 150,
        "label": "CARTAGENA DE INDIAS"
    },
    {
        "value": 151,
        "label": "ACHÍ"
    },
    {
        "value": 152,
        "label": "ALTOS DEL ROSARIO"
    },
    {
        "value": 153,
        "label": "ARENAL"
    },
    {
        "value": 154,
        "label": "ARJONA"
    },
    {
        "value": 155,
        "label": "ARROYOHONDO"
    },
    {
        "value": 156,
        "label": "BARRANCO DE LOBA"
    },
    {
        "value": 157,
        "label": "CALAMAR"
    },
    {
        "value": 158,
        "label": "CANTAGALLO"
    },
    {
        "value": 159,
        "label": "CICUCO"
    },
    {
        "value": 160,
        "label": "CÓRDOBA"
    },
    {
        "value": 161,
        "label": "CLEMENCIA"
    },
    {
        "value": 162,
        "label": "EL CARMEN DE BOLÍVAR"
    },
    {
        "value": 163,
        "label": "EL GUAMO"
    },
    {
        "value": 164,
        "label": "EL PEÑÓN"
    },
    {
        "value": 165,
        "label": "HATILLO DE LOBA"
    },
    {
        "value": 166,
        "label": "MAGANGUÉ"
    },
    {
        "value": 167,
        "label": "MAHATES"
    },
    {
        "value": 168,
        "label": "MARGARITA"
    },
    {
        "value": 169,
        "label": "MARÍA LA BAJA"
    },
    {
        "value": 170,
        "label": "MONTECRISTO"
    },
    {
        "value": 171,
        "label": "MOMPÓS"
    },
    {
        "value": 172,
        "label": "MORALES"
    },
    {
        "value": 173,
        "label": "NOROSÍ"
    },
    {
        "value": 174,
        "label": "PINILLOS"
    },
    {
        "value": 175,
        "label": "REGIDOR"
    },
    {
        "value": 176,
        "label": "RÍO VIEJO"
    },
    {
        "value": 177,
        "label": "SAN CRISTÓBAL"
    },
    {
        "value": 178,
        "label": "SAN ESTANISLAO"
    },
    {
        "value": 179,
        "label": "SAN FERNANDO"
    },
    {
        "value": 180,
        "label": "SAN JACINTO"
    },
    {
        "value": 181,
        "label": "SAN JACINTO DEL CAUCA"
    },
    {
        "value": 182,
        "label": "SAN JUAN NEPOMUCENO"
    },
    {
        "value": 183,
        "label": "SAN MARTÍN DE LOBA"
    },
    {
        "value": 184,
        "label": "SAN PABLO"
    },
    {
        "value": 185,
        "label": "SANTA CATALINA"
    },
    {
        "value": 186,
        "label": "SANTA ROSA"
    },
    {
        "value": 187,
        "label": "SANTA ROSA DEL SUR"
    },
    {
        "value": 188,
        "label": "SIMITÍ"
    },
    {
        "value": 189,
        "label": "SOPLAVIENTO"
    },
    {
        "value": 190,
        "label": "TALAIGUA NUEVO"
    },
    {
        "value": 191,
        "label": "TIQUISIO"
    },
    {
        "value": 192,
        "label": "TURBACO"
    },
    {
        "value": 193,
        "label": "TURBANÁ"
    },
    {
        "value": 194,
        "label": "VILLANUEVA"
    },
    {
        "value": 195,
        "label": "ZAMBRANO"
    },
    {
        "value": 196,
        "label": "TUNJA"
    },
    {
        "value": 197,
        "label": "ALMEIDA"
    },
    {
        "value": 198,
        "label": "AQUITANIA"
    },
    {
        "value": 199,
        "label": "ARCABUCO"
    },
    {
        "value": 200,
        "label": "BELÉN"
    },
    {
        "value": 201,
        "label": "BERBEO"
    },
    {
        "value": 202,
        "label": "BETÉITIVA"
    },
    {
        "value": 203,
        "label": "BOAVITA"
    },
    {
        "value": 204,
        "label": "BOYACÁ"
    },
    {
        "value": 205,
        "label": "BRICEÑO"
    },
    {
        "value": 206,
        "label": "BUENAVISTA"
    },
    {
        "value": 207,
        "label": "BUSBANZÁ"
    },
    {
        "value": 208,
        "label": "CALDAS"
    },
    {
        "value": 209,
        "label": "CAMPOHERMOSO"
    },
    {
        "value": 210,
        "label": "CERINZA"
    },
    {
        "value": 211,
        "label": "CHINAVITA"
    },
    {
        "value": 212,
        "label": "CHIQUINQUIRÁ"
    },
    {
        "value": 213,
        "label": "CHISCAS"
    },
    {
        "value": 214,
        "label": "CHITA"
    },
    {
        "value": 215,
        "label": "CHITARAQUE"
    },
    {
        "value": 216,
        "label": "CHIVATÁ"
    },
    {
        "value": 217,
        "label": "CIÉNEGA"
    },
    {
        "value": 218,
        "label": "CÓMBITA"
    },
    {
        "value": 219,
        "label": "COPER"
    },
    {
        "value": 220,
        "label": "CORRALES"
    },
    {
        "value": 221,
        "label": "COVARACHÍA"
    },
    {
        "value": 222,
        "label": "CUBARÁ"
    },
    {
        "value": 223,
        "label": "CUCAITA"
    },
    {
        "value": 224,
        "label": "CUÍTIVA"
    },
    {
        "value": 225,
        "label": "CHÍQUIZA"
    },
    {
        "value": 226,
        "label": "CHIVOR"
    },
    {
        "value": 227,
        "label": "DUITAMA"
    },
    {
        "value": 228,
        "label": "EL COCUY"
    },
    {
        "value": 229,
        "label": "EL ESPINO"
    },
    {
        "value": 230,
        "label": "FIRAVITOBA"
    },
    {
        "value": 231,
        "label": "FLORESTA"
    },
    {
        "value": 232,
        "label": "GACHANTIVÁ"
    },
    {
        "value": 233,
        "label": "GÁMEZA"
    },
    {
        "value": 234,
        "label": "GARAGOA"
    },
    {
        "value": 235,
        "label": "GUACAMAYAS"
    },
    {
        "value": 236,
        "label": "GUATEQUE"
    },
    {
        "value": 237,
        "label": "GUAYATÁ"
    },
    {
        "value": 238,
        "label": "GÜICÁN DE LA SIERRA"
    },
    {
        "value": 239,
        "label": "IZA"
    },
    {
        "value": 240,
        "label": "JENESANO"
    },
    {
        "value": 241,
        "label": "JERICÓ"
    },
    {
        "value": 242,
        "label": "LABRANZAGRANDE"
    },
    {
        "value": 243,
        "label": "LA CAPILLA"
    },
    {
        "value": 244,
        "label": "LA VICTORIA"
    },
    {
        "value": 245,
        "label": "LA UVITA"
    },
    {
        "value": 246,
        "label": "VILLA DE LEYVA"
    },
    {
        "value": 247,
        "label": "MACANAL"
    },
    {
        "value": 248,
        "label": "MARIPÍ"
    },
    {
        "value": 249,
        "label": "MIRAFLORES"
    },
    {
        "value": 250,
        "label": "MONGUA"
    },
    {
        "value": 251,
        "label": "MONGUÍ"
    },
    {
        "value": 252,
        "label": "MONIQUIRÁ"
    },
    {
        "value": 253,
        "label": "MOTAVITA"
    },
    {
        "value": 254,
        "label": "MUZO"
    },
    {
        "value": 255,
        "label": "NOBSA"
    },
    {
        "value": 256,
        "label": "NUEVO COLÓN"
    },
    {
        "value": 257,
        "label": "OICATÁ"
    },
    {
        "value": 258,
        "label": "OTANCHE"
    },
    {
        "value": 259,
        "label": "PACHAVITA"
    },
    {
        "value": 260,
        "label": "PÁEZ"
    },
    {
        "value": 261,
        "label": "PAIPA"
    },
    {
        "value": 262,
        "label": "PAJARITO"
    },
    {
        "value": 263,
        "label": "PANQUEBA"
    },
    {
        "value": 264,
        "label": "PAUNA"
    },
    {
        "value": 265,
        "label": "PAYA"
    },
    {
        "value": 266,
        "label": "PAZ DE RÍO"
    },
    {
        "value": 267,
        "label": "PESCA"
    },
    {
        "value": 268,
        "label": "PISBA"
    },
    {
        "value": 269,
        "label": "PUERTO BOYACÁ"
    },
    {
        "value": 270,
        "label": "QUÍPAMA"
    },
    {
        "value": 271,
        "label": "RAMIRIQUÍ"
    },
    {
        "value": 272,
        "label": "RÁQUIRA"
    },
    {
        "value": 273,
        "label": "RONDÓN"
    },
    {
        "value": 274,
        "label": "SABOYÁ"
    },
    {
        "value": 275,
        "label": "SÁCHICA"
    },
    {
        "value": 276,
        "label": "SAMACÁ"
    },
    {
        "value": 277,
        "label": "SAN EDUARDO"
    },
    {
        "value": 278,
        "label": "SAN JOSÉ DE PARE"
    },
    {
        "value": 279,
        "label": "SAN LUIS DE GACENO"
    },
    {
        "value": 280,
        "label": "SAN MATEO"
    },
    {
        "value": 281,
        "label": "SAN MIGUEL DE SEMA"
    },
    {
        "value": 282,
        "label": "SAN PABLO DE BORBUR"
    },
    {
        "value": 283,
        "label": "SANTANA"
    },
    {
        "value": 284,
        "label": "SANTA MARÍA"
    },
    {
        "value": 285,
        "label": "SANTA ROSA DE VITERBO"
    },
    {
        "value": 286,
        "label": "SANTA SOFÍA"
    },
    {
        "value": 287,
        "label": "SATIVANORTE"
    },
    {
        "value": 288,
        "label": "SATIVASUR"
    },
    {
        "value": 289,
        "label": "SIACHOQUE"
    },
    {
        "value": 290,
        "label": "SOATÁ"
    },
    {
        "value": 291,
        "label": "SOCOTÁ"
    },
    {
        "value": 292,
        "label": "SOCHA"
    },
    {
        "value": 293,
        "label": "SOGAMOSO"
    },
    {
        "value": 294,
        "label": "SOMONDOCO"
    },
    {
        "value": 295,
        "label": "SORA"
    },
    {
        "value": 296,
        "label": "SOTAQUIRÁ"
    },
    {
        "value": 297,
        "label": "SORACÁ"
    },
    {
        "value": 298,
        "label": "SUSACÓN"
    },
    {
        "value": 299,
        "label": "SUTAMARCHÁN"
    },
    {
        "value": 300,
        "label": "SUTATENZA"
    },
    {
        "value": 301,
        "label": "TASCO"
    },
    {
        "value": 302,
        "label": "TENZA"
    },
    {
        "value": 303,
        "label": "TIBANÁ"
    },
    {
        "value": 304,
        "label": "TIBASOSA"
    },
    {
        "value": 305,
        "label": "TINJACÁ"
    },
    {
        "value": 306,
        "label": "TIPACOQUE"
    },
    {
        "value": 307,
        "label": "TOCA"
    },
    {
        "value": 308,
        "label": "TOGÜÍ"
    },
    {
        "value": 309,
        "label": "TÓPAGA"
    },
    {
        "value": 310,
        "label": "TOTA"
    },
    {
        "value": 311,
        "label": "TUNUNGUÁ"
    },
    {
        "value": 312,
        "label": "TURMEQUÉ"
    },
    {
        "value": 313,
        "label": "TUTA"
    },
    {
        "value": 314,
        "label": "TUTAZÁ"
    },
    {
        "value": 315,
        "label": "ÚMBITA"
    },
    {
        "value": 316,
        "label": "VENTAQUEMADA"
    },
    {
        "value": 317,
        "label": "VIRACACHÁ"
    },
    {
        "value": 318,
        "label": "ZETAQUIRA"
    },
    {
        "value": 319,
        "label": "MANIZALES"
    },
    {
        "value": 320,
        "label": "AGUADAS"
    },
    {
        "value": 321,
        "label": "ANSERMA"
    },
    {
        "value": 322,
        "label": "ARANZAZU"
    },
    {
        "value": 323,
        "label": "BELALCÁZAR"
    },
    {
        "value": 324,
        "label": "CHINCHINÁ"
    },
    {
        "value": 325,
        "label": "FILADELFIA"
    },
    {
        "value": 326,
        "label": "LA DORADA"
    },
    {
        "value": 327,
        "label": "LA MERCED"
    },
    {
        "value": 328,
        "label": "MANZANARES"
    },
    {
        "value": 329,
        "label": "MARMATO"
    },
    {
        "value": 330,
        "label": "MARQUETALIA"
    },
    {
        "value": 331,
        "label": "MARULANDA"
    },
    {
        "value": 332,
        "label": "NEIRA"
    },
    {
        "value": 333,
        "label": "NORCASIA"
    },
    {
        "value": 334,
        "label": "PÁCORA"
    },
    {
        "value": 335,
        "label": "PALESTINA"
    },
    {
        "value": 336,
        "label": "PENSILVANIA"
    },
    {
        "value": 337,
        "label": "RIOSUCIO"
    },
    {
        "value": 338,
        "label": "RISARALDA"
    },
    {
        "value": 339,
        "label": "SALAMINA"
    },
    {
        "value": 340,
        "label": "SAMANÁ"
    },
    {
        "value": 341,
        "label": "SAN JOSÉ"
    },
    {
        "value": 342,
        "label": "SUPÍA"
    },
    {
        "value": 343,
        "label": "VICTORIA"
    },
    {
        "value": 344,
        "label": "VILLAMARÍA"
    },
    {
        "value": 345,
        "label": "VITERBO"
    },
    {
        "value": 346,
        "label": "FLORENCIA"
    },
    {
        "value": 347,
        "label": "ALBANIA"
    },
    {
        "value": 348,
        "label": "BELÉN DE LOS ANDAQUÍES"
    },
    {
        "value": 349,
        "label": "CARTAGENA DEL CHAIRÁ"
    },
    {
        "value": 350,
        "label": "CURILLO"
    },
    {
        "value": 351,
        "label": "EL DONCELLO"
    },
    {
        "value": 352,
        "label": "EL PAUJÍL"
    },
    {
        "value": 353,
        "label": "LA MONTAÑITA"
    },
    {
        "value": 354,
        "label": "MILÁN"
    },
    {
        "value": 355,
        "label": "MORELIA"
    },
    {
        "value": 356,
        "label": "PUERTO RICO"
    },
    {
        "value": 357,
        "label": "SAN JOSÉ DEL FRAGUA"
    },
    {
        "value": 358,
        "label": "SAN VICENTE DEL CAGUÁN"
    },
    {
        "value": 359,
        "label": "SOLANO"
    },
    {
        "value": 360,
        "label": "SOLITA"
    },
    {
        "value": 361,
        "label": "VALPARAÍSO"
    },
    {
        "value": 362,
        "label": "POPAYÁN"
    },
    {
        "value": 363,
        "label": "ALMAGUER"
    },
    {
        "value": 364,
        "label": "ARGELIA"
    },
    {
        "value": 365,
        "label": "BALBOA"
    },
    {
        "value": 366,
        "label": "BOLÍVAR"
    },
    {
        "value": 367,
        "label": "BUENOS AIRES"
    },
    {
        "value": 368,
        "label": "CAJIBÍO"
    },
    {
        "value": 369,
        "label": "CALDONO"
    },
    {
        "value": 370,
        "label": "CALOTO"
    },
    {
        "value": 371,
        "label": "CORINTO"
    },
    {
        "value": 372,
        "label": "EL TAMBO"
    },
    {
        "value": 373,
        "label": "FLORENCIA"
    },
    {
        "value": 374,
        "label": "GUACHENÉ"
    },
    {
        "value": 375,
        "label": "GUAPÍ"
    },
    {
        "value": 376,
        "label": "INZÁ"
    },
    {
        "value": 377,
        "label": "JAMBALÓ"
    },
    {
        "value": 378,
        "label": "LA SIERRA"
    },
    {
        "value": 379,
        "label": "LA VEGA"
    },
    {
        "value": 380,
        "label": "LÓPEZ DE MICAY"
    },
    {
        "value": 381,
        "label": "MERCADERES"
    },
    {
        "value": 382,
        "label": "MIRANDA"
    },
    {
        "value": 383,
        "label": "MORALES"
    },
    {
        "value": 384,
        "label": "PADILLA"
    },
    {
        "value": 385,
        "label": "PÁEZ"
    },
    {
        "value": 386,
        "label": "PATÍA"
    },
    {
        "value": 387,
        "label": "PIAMONTE"
    },
    {
        "value": 388,
        "label": "PIENDAMÓ - TUNÍA"
    },
    {
        "value": 389,
        "label": "PUERTO TEJADA"
    },
    {
        "value": 390,
        "label": "PURACÉ"
    },
    {
        "value": 391,
        "label": "ROSAS"
    },
    {
        "value": 392,
        "label": "SAN SEBASTIÁN"
    },
    {
        "value": 393,
        "label": "SANTANDER DE QUILICHAO"
    },
    {
        "value": 394,
        "label": "SANTA ROSA"
    },
    {
        "value": 395,
        "label": "SILVIA"
    },
    {
        "value": 396,
        "label": "SOTARA"
    },
    {
        "value": 397,
        "label": "SUÁREZ"
    },
    {
        "value": 398,
        "label": "SUCRE"
    },
    {
        "value": 399,
        "label": "TIMBÍO"
    },
    {
        "value": 400,
        "label": "TIMBIQUÍ"
    },
    {
        "value": 401,
        "label": "TORIBÍO"
    },
    {
        "value": 402,
        "label": "TOTORÓ"
    },
    {
        "value": 403,
        "label": "VILLA RICA"
    },
    {
        "value": 404,
        "label": "VALLEDUPAR"
    },
    {
        "value": 405,
        "label": "AGUACHICA"
    },
    {
        "value": 406,
        "label": "AGUSTÍN CODAZZI"
    },
    {
        "value": 407,
        "label": "ASTREA"
    },
    {
        "value": 408,
        "label": "BECERRIL"
    },
    {
        "value": 409,
        "label": "BOSCONIA"
    },
    {
        "value": 410,
        "label": "CHIMICHAGUA"
    },
    {
        "value": 411,
        "label": "CHIRIGUANÁ"
    },
    {
        "value": 412,
        "label": "CURUMANÍ"
    },
    {
        "value": 413,
        "label": "EL COPEY"
    },
    {
        "value": 414,
        "label": "EL PASO"
    },
    {
        "value": 415,
        "label": "GAMARRA"
    },
    {
        "value": 416,
        "label": "GONZÁLEZ"
    },
    {
        "value": 417,
        "label": "LA GLORIA"
    },
    {
        "value": 418,
        "label": "LA JAGUA DE IBIRICO"
    },
    {
        "value": 419,
        "label": "MANAURE BALCÓN DEL CESAR"
    },
    {
        "value": 420,
        "label": "PAILITAS"
    },
    {
        "value": 421,
        "label": "PELAYA"
    },
    {
        "value": 422,
        "label": "PUEBLO BELLO"
    },
    {
        "value": 423,
        "label": "RÍO DE ORO"
    },
    {
        "value": 424,
        "label": "LA PAZ"
    },
    {
        "value": 425,
        "label": "SAN ALBERTO"
    },
    {
        "value": 426,
        "label": "SAN DIEGO"
    },
    {
        "value": 427,
        "label": "SAN MARTÍN"
    },
    {
        "value": 428,
        "label": "TAMALAMEQUE"
    },
    {
        "value": 429,
        "label": "MONTERÍA"
    },
    {
        "value": 430,
        "label": "AYAPEL"
    },
    {
        "value": 431,
        "label": "BUENAVISTA"
    },
    {
        "value": 432,
        "label": "CANALETE"
    },
    {
        "value": 433,
        "label": "CERETÉ"
    },
    {
        "value": 434,
        "label": "CHIMÁ"
    },
    {
        "value": 435,
        "label": "CHINÚ"
    },
    {
        "value": 436,
        "label": "CIÉNAGA DE ORO"
    },
    {
        "value": 437,
        "label": "COTORRA"
    },
    {
        "value": 438,
        "label": "LA APARTADA"
    },
    {
        "value": 439,
        "label": "LORICA"
    },
    {
        "value": 440,
        "label": "LOS CÓRDOBAS"
    },
    {
        "value": 441,
        "label": "MOMIL"
    },
    {
        "value": 442,
        "label": "MONTELÍBANO"
    },
    {
        "value": 443,
        "label": "MOÑITOS"
    },
    {
        "value": 444,
        "label": "PLANETA RICA"
    },
    {
        "value": 445,
        "label": "PUEBLO NUEVO"
    },
    {
        "value": 446,
        "label": "PUERTO ESCONDIDO"
    },
    {
        "value": 447,
        "label": "PUERTO LIBERTADOR"
    },
    {
        "value": 448,
        "label": "PURÍSIMA DE LA CONCEPCIÓN"
    },
    {
        "value": 449,
        "label": "SAHAGÚN"
    },
    {
        "value": 450,
        "label": "SAN ANDRÉS DE SOTAVENTO"
    },
    {
        "value": 451,
        "label": "SAN ANTERO"
    },
    {
        "value": 452,
        "label": "SAN BERNARDO DEL VIENTO"
    },
    {
        "value": 453,
        "label": "SAN CARLOS"
    },
    {
        "value": 454,
        "label": "SAN JOSÉ DE URÉ"
    },
    {
        "value": 455,
        "label": "SAN PELAYO"
    },
    {
        "value": 456,
        "label": "TIERRALTA"
    },
    {
        "value": 457,
        "label": "TUCHÍN"
    },
    {
        "value": 458,
        "label": "VALENCIA"
    },
    {
        "value": 459,
        "label": "AGUA DE DIOS"
    },
    {
        "value": 460,
        "label": "ALBÁN"
    },
    {
        "value": 461,
        "label": "ANAPOIMA"
    },
    {
        "value": 462,
        "label": "ANOLAIMA"
    },
    {
        "value": 463,
        "label": "ARBELÁEZ"
    },
    {
        "value": 464,
        "label": "BELTRÁN"
    },
    {
        "value": 465,
        "label": "BITUIMA"
    },
    {
        "value": 466,
        "label": "BOJACÁ"
    },
    {
        "value": 467,
        "label": "CABRERA"
    },
    {
        "value": 468,
        "label": "CACHIPAY"
    },
    {
        "value": 469,
        "label": "CAJICÁ"
    },
    {
        "value": 470,
        "label": "CAPARRAPÍ"
    },
    {
        "value": 471,
        "label": "CÁQUEZA"
    },
    {
        "value": 472,
        "label": "CARMEN DE CARUPA"
    },
    {
        "value": 473,
        "label": "CHAGUANÍ"
    },
    {
        "value": 474,
        "label": "CHÍA"
    },
    {
        "value": 475,
        "label": "CHIPAQUE"
    },
    {
        "value": 476,
        "label": "CHOACHÍ"
    },
    {
        "value": 477,
        "label": "CHOCONTÁ"
    },
    {
        "value": 478,
        "label": "COGUA"
    },
    {
        "value": 479,
        "label": "COTA"
    },
    {
        "value": 480,
        "label": "CUCUNUBÁ"
    },
    {
        "value": 481,
        "label": "EL COLEGIO"
    },
    {
        "value": 482,
        "label": "EL PEÑÓN"
    },
    {
        "value": 483,
        "label": "EL ROSAL"
    },
    {
        "value": 484,
        "label": "FACATATIVÁ"
    },
    {
        "value": 485,
        "label": "FÓMEQUE"
    },
    {
        "value": 486,
        "label": "FOSCA"
    },
    {
        "value": 487,
        "label": "FUNZA"
    },
    {
        "value": 488,
        "label": "FÚQUENE"
    },
    {
        "value": 489,
        "label": "FUSAGASUGÁ"
    },
    {
        "value": 490,
        "label": "GACHALÁ"
    },
    {
        "value": 491,
        "label": "GACHANCIPÁ"
    },
    {
        "value": 492,
        "label": "GACHETÁ"
    },
    {
        "value": 493,
        "label": "GAMA"
    },
    {
        "value": 494,
        "label": "GIRARDOT"
    },
    {
        "value": 495,
        "label": "GRANADA"
    },
    {
        "value": 496,
        "label": "GUACHETÁ"
    },
    {
        "value": 497,
        "label": "GUADUAS"
    },
    {
        "value": 498,
        "label": "GUASCA"
    },
    {
        "value": 499,
        "label": "GUATAQUÍ"
    },
    {
        "value": 500,
        "label": "GUATAVITA"
    },
    {
        "value": 501,
        "label": "GUAYABAL DE SÍQUIMA"
    },
    {
        "value": 502,
        "label": "GUAYABETAL"
    },
    {
        "value": 503,
        "label": "GUTIÉRREZ"
    },
    {
        "value": 504,
        "label": "JERUSALÉN"
    },
    {
        "value": 505,
        "label": "JUNÍN"
    },
    {
        "value": 506,
        "label": "LA CALERA"
    },
    {
        "value": 507,
        "label": "LA MESA"
    },
    {
        "value": 508,
        "label": "LA PALMA"
    },
    {
        "value": 509,
        "label": "LA PEÑA"
    },
    {
        "value": 510,
        "label": "LA VEGA"
    },
    {
        "value": 511,
        "label": "LENGUAZAQUE"
    },
    {
        "value": 512,
        "label": "MACHETÁ"
    },
    {
        "value": 513,
        "label": "MADRID"
    },
    {
        "value": 514,
        "label": "MANTA"
    },
    {
        "value": 515,
        "label": "MEDINA"
    },
    {
        "value": 516,
        "label": "MOSQUERA"
    },
    {
        "value": 517,
        "label": "NARIÑO"
    },
    {
        "value": 518,
        "label": "NEMOCÓN"
    },
    {
        "value": 519,
        "label": "NILO"
    },
    {
        "value": 520,
        "label": "NIMAIMA"
    },
    {
        "value": 521,
        "label": "NOCAIMA"
    },
    {
        "value": 522,
        "label": "VENECIA"
    },
    {
        "value": 523,
        "label": "PACHO"
    },
    {
        "value": 524,
        "label": "PAIME"
    },
    {
        "value": 525,
        "label": "PANDI"
    },
    {
        "value": 526,
        "label": "PARATEBUENO"
    },
    {
        "value": 527,
        "label": "PASCA"
    },
    {
        "value": 528,
        "label": "PUERTO SALGAR"
    },
    {
        "value": 529,
        "label": "PULÍ"
    },
    {
        "value": 530,
        "label": "QUEBRADANEGRA"
    },
    {
        "value": 531,
        "label": "QUETAME"
    },
    {
        "value": 532,
        "label": "QUIPILE"
    },
    {
        "value": 533,
        "label": "APULO"
    },
    {
        "value": 534,
        "label": "RICAURTE"
    },
    {
        "value": 535,
        "label": "SAN ANTONIO DEL TEQUENDAMA"
    },
    {
        "value": 536,
        "label": "SAN BERNARDO"
    },
    {
        "value": 537,
        "label": "SAN CAYETANO"
    },
    {
        "value": 538,
        "label": "SAN FRANCISCO"
    },
    {
        "value": 539,
        "label": "SAN JUAN DE RIOSECO"
    },
    {
        "value": 540,
        "label": "SASAIMA"
    },
    {
        "value": 541,
        "label": "SESQUILÉ"
    },
    {
        "value": 542,
        "label": "SIBATÉ"
    },
    {
        "value": 543,
        "label": "SILVANIA"
    },
    {
        "value": 544,
        "label": "SIMIJACA"
    },
    {
        "value": 545,
        "label": "SOACHA"
    },
    {
        "value": 546,
        "label": "SOPÓ"
    },
    {
        "value": 547,
        "label": "SUBACHOQUE"
    },
    {
        "value": 548,
        "label": "SUESCA"
    },
    {
        "value": 549,
        "label": "SUPATÁ"
    },
    {
        "value": 550,
        "label": "SUSA"
    },
    {
        "value": 551,
        "label": "SUTATAUSA"
    },
    {
        "value": 552,
        "label": "TABIO"
    },
    {
        "value": 553,
        "label": "TAUSA"
    },
    {
        "value": 554,
        "label": "TENA"
    },
    {
        "value": 555,
        "label": "TENJO"
    },
    {
        "value": 556,
        "label": "TIBACUY"
    },
    {
        "value": 557,
        "label": "TIBIRITA"
    },
    {
        "value": 558,
        "label": "TOCAIMA"
    },
    {
        "value": 559,
        "label": "TOCANCIPÁ"
    },
    {
        "value": 560,
        "label": "TOPAIPÍ"
    },
    {
        "value": 561,
        "label": "UBALÁ"
    },
    {
        "value": 562,
        "label": "UBAQUE"
    },
    {
        "value": 563,
        "label": "VILLA DE SAN DIEGO DE UBATÉ"
    },
    {
        "value": 564,
        "label": "UNE"
    },
    {
        "value": 565,
        "label": "ÚTICA"
    },
    {
        "value": 566,
        "label": "VERGARA"
    },
    {
        "value": 567,
        "label": "VIANÍ"
    },
    {
        "value": 568,
        "label": "VILLAGÓMEZ"
    },
    {
        "value": 569,
        "label": "VILLAPINZÓN"
    },
    {
        "value": 570,
        "label": "VILLETA"
    },
    {
        "value": 571,
        "label": "VIOTÁ"
    },
    {
        "value": 572,
        "label": "YACOPÍ"
    },
    {
        "value": 573,
        "label": "ZIPACÓN"
    },
    {
        "value": 574,
        "label": "ZIPAQUIRÁ"
    },
    {
        "value": 575,
        "label": "QUIBDÓ"
    },
    {
        "value": 576,
        "label": "ACANDÍ"
    },
    {
        "value": 577,
        "label": "ALTO BAUDÓ"
    },
    {
        "value": 578,
        "label": "ATRATO"
    },
    {
        "value": 579,
        "label": "BAGADÓ"
    },
    {
        "value": 580,
        "label": "BAHÍA SOLANO"
    },
    {
        "value": 581,
        "label": "BAJO BAUDÓ"
    },
    {
        "value": 582,
        "label": "Belén De Bajira"
    },
    {
        "value": 583,
        "label": "BOJAYÁ"
    },
    {
        "value": 584,
        "label": "EL CANTÓN DEL SAN PABLO"
    },
    {
        "value": 585,
        "label": "CARMEN DEL DARIÉN"
    },
    {
        "value": 586,
        "label": "CÉRTEGUI"
    },
    {
        "value": 587,
        "label": "CONDOTO"
    },
    {
        "value": 588,
        "label": "EL CARMEN DE ATRATO"
    },
    {
        "value": 589,
        "label": "EL LITORAL DEL SAN JUAN"
    },
    {
        "value": 590,
        "label": "ISTMINA"
    },
    {
        "value": 591,
        "label": "JURADÓ"
    },
    {
        "value": 592,
        "label": "LLORÓ"
    },
    {
        "value": 593,
        "label": "MEDIO ATRATO"
    },
    {
        "value": 594,
        "label": "MEDIO BAUDÓ"
    },
    {
        "value": 595,
        "label": "MEDIO SAN JUAN"
    },
    {
        "value": 596,
        "label": "NÓVITA"
    },
    {
        "value": 597,
        "label": "Nuevo Belén de Bajirá"
    },
    {
        "value": 598,
        "label": "NUQUÍ"
    },
    {
        "value": 599,
        "label": "RÍO IRÓ"
    },
    {
        "value": 600,
        "label": "RÍO QUITO"
    },
    {
        "value": 601,
        "label": "RIOSUCIO"
    },
    {
        "value": 602,
        "label": "SAN JOSÉ DEL PALMAR"
    },
    {
        "value": 603,
        "label": "SIPÍ"
    },
    {
        "value": 604,
        "label": "TADÓ"
    },
    {
        "value": 605,
        "label": "UNGUÍA"
    },
    {
        "value": 606,
        "label": "UNIÓN PANAMERICANA"
    },
    {
        "value": 607,
        "label": "NEIVA"
    },
    {
        "value": 608,
        "label": "ACEVEDO"
    },
    {
        "value": 609,
        "label": "AGRADO"
    },
    {
        "value": 610,
        "label": "AIPE"
    },
    {
        "value": 611,
        "label": "ALGECIRAS"
    },
    {
        "value": 612,
        "label": "ALTAMIRA"
    },
    {
        "value": 613,
        "label": "BARAYA"
    },
    {
        "value": 614,
        "label": "CAMPOALEGRE"
    },
    {
        "value": 615,
        "label": "COLOMBIA"
    },
    {
        "value": 616,
        "label": "ELÍAS"
    },
    {
        "value": 617,
        "label": "GARZÓN"
    },
    {
        "value": 618,
        "label": "GIGANTE"
    },
    {
        "value": 619,
        "label": "GUADALUPE"
    },
    {
        "value": 620,
        "label": "HOBO"
    },
    {
        "value": 621,
        "label": "ÍQUIRA"
    },
    {
        "value": 622,
        "label": "ISNOS"
    },
    {
        "value": 623,
        "label": "LA ARGENTINA"
    },
    {
        "value": 624,
        "label": "LA PLATA"
    },
    {
        "value": 625,
        "label": "NÁTAGA"
    },
    {
        "value": 626,
        "label": "OPORAPA"
    },
    {
        "value": 627,
        "label": "PAICOL"
    },
    {
        "value": 628,
        "label": "PALERMO"
    },
    {
        "value": 629,
        "label": "PALESTINA"
    },
    {
        "value": 630,
        "label": "PITAL"
    },
    {
        "value": 631,
        "label": "PITALITO"
    },
    {
        "value": 632,
        "label": "RIVERA"
    },
    {
        "value": 633,
        "label": "SALADOBLANCO"
    },
    {
        "value": 634,
        "label": "SAN AGUSTÍN"
    },
    {
        "value": 635,
        "label": "SANTA MARÍA"
    },
    {
        "value": 636,
        "label": "SUAZA"
    },
    {
        "value": 637,
        "label": "TARQUI"
    },
    {
        "value": 638,
        "label": "TESALIA"
    },
    {
        "value": 639,
        "label": "TELLO"
    },
    {
        "value": 640,
        "label": "TERUEL"
    },
    {
        "value": 641,
        "label": "TIMANÁ"
    },
    {
        "value": 642,
        "label": "VILLAVIEJA"
    },
    {
        "value": 643,
        "label": "YAGUARÁ"
    },
    {
        "value": 644,
        "label": "RIOHACHA"
    },
    {
        "value": 645,
        "label": "ALBANIA"
    },
    {
        "value": 646,
        "label": "BARRANCAS"
    },
    {
        "value": 647,
        "label": "DIBULLA"
    },
    {
        "value": 648,
        "label": "DISTRACCIÓN"
    },
    {
        "value": 649,
        "label": "EL MOLINO"
    },
    {
        "value": 650,
        "label": "FONSECA"
    },
    {
        "value": 651,
        "label": "HATONUEVO"
    },
    {
        "value": 652,
        "label": "LA JAGUA DEL PILAR"
    },
    {
        "value": 653,
        "label": "MAICAO"
    },
    {
        "value": 654,
        "label": "MANAURE"
    },
    {
        "value": 655,
        "label": "SAN JUAN DEL CESAR"
    },
    {
        "value": 656,
        "label": "URIBIA"
    },
    {
        "value": 657,
        "label": "URUMITA"
    },
    {
        "value": 658,
        "label": "VILLANUEVA"
    },
    {
        "value": 659,
        "label": "SANTA MARTA"
    },
    {
        "value": 660,
        "label": "ALGARROBO"
    },
    {
        "value": 661,
        "label": "ARACATACA"
    },
    {
        "value": 662,
        "label": "ARIGUANÍ"
    },
    {
        "value": 663,
        "label": "CERRO DE SAN ANTONIO"
    },
    {
        "value": 664,
        "label": "CHIVOLO"
    },
    {
        "value": 665,
        "label": "CIÉNAGA"
    },
    {
        "value": 666,
        "label": "CONCORDIA"
    },
    {
        "value": 667,
        "label": "EL BANCO"
    },
    {
        "value": 668,
        "label": "EL PIÑÓN"
    },
    {
        "value": 669,
        "label": "EL RETÉN"
    },
    {
        "value": 670,
        "label": "FUNDACIÓN"
    },
    {
        "value": 671,
        "label": "GUAMAL"
    },
    {
        "value": 672,
        "label": "NUEVA GRANADA"
    },
    {
        "value": 673,
        "label": "PEDRAZA"
    },
    {
        "value": 674,
        "label": "PIJIÑO DEL CARMEN"
    },
    {
        "value": 675,
        "label": "PIVIJAY"
    },
    {
        "value": 676,
        "label": "PLATO"
    },
    {
        "value": 677,
        "label": "PUEBLOVIEJO"
    },
    {
        "value": 678,
        "label": "REMOLINO"
    },
    {
        "value": 679,
        "label": "SABANAS DE SAN ÁNGEL"
    },
    {
        "value": 680,
        "label": "SALAMINA"
    },
    {
        "value": 681,
        "label": "SAN SEBASTIÁN DE BUENAVISTA"
    },
    {
        "value": 682,
        "label": "SAN ZENÓN"
    },
    {
        "value": 683,
        "label": "SANTA ANA"
    },
    {
        "value": 684,
        "label": "SANTA BÁRBARA DE PINTO"
    },
    {
        "value": 685,
        "label": "SITIONUEVO"
    },
    {
        "value": 686,
        "label": "TENERIFE"
    },
    {
        "value": 687,
        "label": "ZAPAYÁN"
    },
    {
        "value": 688,
        "label": "ZONA BANANERA"
    },
    {
        "value": 689,
        "label": "VILLAVICENCIO"
    },
    {
        "value": 690,
        "label": "ACACÍAS"
    },
    {
        "value": 691,
        "label": "BARRANCA DE UPÍA"
    },
    {
        "value": 692,
        "label": "CABUYARO"
    },
    {
        "value": 693,
        "label": "CASTILLA LA NUEVA"
    },
    {
        "value": 694,
        "label": "CUBARRAL"
    },
    {
        "value": 695,
        "label": "CUMARAL"
    },
    {
        "value": 696,
        "label": "EL CALVARIO"
    },
    {
        "value": 697,
        "label": "EL CASTILLO"
    },
    {
        "value": 698,
        "label": "EL DORADO"
    },
    {
        "value": 699,
        "label": "FUENTE DE ORO"
    },
    {
        "value": 700,
        "label": "GRANADA"
    },
    {
        "value": 701,
        "label": "GUAMAL"
    },
    {
        "value": 702,
        "label": "MAPIRIPÁN"
    },
    {
        "value": 703,
        "label": "MESETAS"
    },
    {
        "value": 704,
        "label": "LA MACARENA"
    },
    {
        "value": 705,
        "label": "URIBE"
    },
    {
        "value": 706,
        "label": "LEJANÍAS"
    },
    {
        "value": 707,
        "label": "PUERTO CONCORDIA"
    },
    {
        "value": 708,
        "label": "PUERTO GAITÁN"
    },
    {
        "value": 709,
        "label": "PUERTO LÓPEZ"
    },
    {
        "value": 710,
        "label": "PUERTO LLERAS"
    },
    {
        "value": 711,
        "label": "PUERTO RICO"
    },
    {
        "value": 712,
        "label": "RESTREPO"
    },
    {
        "value": 713,
        "label": "SAN CARLOS DE GUAROA"
    },
    {
        "value": 714,
        "label": "SAN JUAN DE ARAMA"
    },
    {
        "value": 715,
        "label": "SAN JUANITO"
    },
    {
        "value": 716,
        "label": "SAN MARTÍN"
    },
    {
        "value": 717,
        "label": "VISTAHERMOSA"
    },
    {
        "value": 718,
        "label": "PASTO"
    },
    {
        "value": 719,
        "label": "ALBÁN"
    },
    {
        "value": 720,
        "label": "ALDANA"
    },
    {
        "value": 721,
        "label": "ANCUYÁ"
    },
    {
        "value": 722,
        "label": "ARBOLEDA"
    },
    {
        "value": 723,
        "label": "BARBACOAS"
    },
    {
        "value": 724,
        "label": "BELÉN"
    },
    {
        "value": 725,
        "label": "BUESACO"
    },
    {
        "value": 726,
        "label": "COLÓN"
    },
    {
        "value": 727,
        "label": "CONSACÁ"
    },
    {
        "value": 728,
        "label": "CONTADERO"
    },
    {
        "value": 729,
        "label": "CÓRDOBA"
    },
    {
        "value": 730,
        "label": "CUASPÚD"
    },
    {
        "value": 731,
        "label": "CUMBAL"
    },
    {
        "value": 732,
        "label": "CUMBITARA"
    },
    {
        "value": 733,
        "label": "CHACHAGÜÍ"
    },
    {
        "value": 734,
        "label": "EL CHARCO"
    },
    {
        "value": 735,
        "label": "EL PEÑOL"
    },
    {
        "value": 736,
        "label": "EL ROSARIO"
    },
    {
        "value": 737,
        "label": "EL TABLÓN DE GÓMEZ"
    },
    {
        "value": 738,
        "label": "EL TAMBO"
    },
    {
        "value": 739,
        "label": "FUNES"
    },
    {
        "value": 740,
        "label": "GUACHUCAL"
    },
    {
        "value": 741,
        "label": "GUAITARILLA"
    },
    {
        "value": 742,
        "label": "GUALMATÁN"
    },
    {
        "value": 743,
        "label": "ILES"
    },
    {
        "value": 744,
        "label": "IMUÉS"
    },
    {
        "value": 745,
        "label": "IPIALES"
    },
    {
        "value": 746,
        "label": "LA CRUZ"
    },
    {
        "value": 747,
        "label": "LA FLORIDA"
    },
    {
        "value": 748,
        "label": "LA LLANADA"
    },
    {
        "value": 749,
        "label": "LA TOLA"
    },
    {
        "value": 750,
        "label": "LA UNIÓN"
    },
    {
        "value": 751,
        "label": "LEIVA"
    },
    {
        "value": 752,
        "label": "LINARES"
    },
    {
        "value": 753,
        "label": "LOS ANDES"
    },
    {
        "value": 754,
        "label": "MAGÜÍ"
    },
    {
        "value": 755,
        "label": "MALLAMA"
    },
    {
        "value": 756,
        "label": "MOSQUERA"
    },
    {
        "value": 757,
        "label": "NARIÑO"
    },
    {
        "value": 758,
        "label": "OLAYA HERRERA"
    },
    {
        "value": 759,
        "label": "OSPINA"
    },
    {
        "value": 760,
        "label": "FRANCISCO PIZARRO"
    },
    {
        "value": 761,
        "label": "POLICARPA"
    },
    {
        "value": 762,
        "label": "POTOSÍ"
    },
    {
        "value": 763,
        "label": "PROVIDENCIA"
    },
    {
        "value": 764,
        "label": "PUERRES"
    },
    {
        "value": 765,
        "label": "PUPIALES"
    },
    {
        "value": 766,
        "label": "RICAURTE"
    },
    {
        "value": 767,
        "label": "ROBERTO PAYÁN"
    },
    {
        "value": 768,
        "label": "SAMANIEGO"
    },
    {
        "value": 769,
        "label": "SANDONÁ"
    },
    {
        "value": 770,
        "label": "SAN BERNARDO"
    },
    {
        "value": 771,
        "label": "SAN LORENZO"
    },
    {
        "value": 772,
        "label": "SAN PABLO"
    },
    {
        "value": 773,
        "label": "SAN PEDRO DE CARTAGO"
    },
    {
        "value": 774,
        "label": "SANTA BÁRBARA"
    },
    {
        "value": 775,
        "label": "SANTACRUZ"
    },
    {
        "value": 776,
        "label": "SAPUYES"
    },
    {
        "value": 777,
        "label": "TAMINANGO"
    },
    {
        "value": 778,
        "label": "TANGUA"
    },
    {
        "value": 779,
        "label": "SAN ANDRÉS DE TUMACO"
    },
    {
        "value": 780,
        "label": "TÚQUERRES"
    },
    {
        "value": 781,
        "label": "YACUANQUER"
    },
    {
        "value": 782,
        "label": "SAN JOSÉ DE CÚCUTA"
    },
    {
        "value": 783,
        "label": "ÁBREGO"
    },
    {
        "value": 784,
        "label": "ARBOLEDAS"
    },
    {
        "value": 785,
        "label": "BOCHALEMA"
    },
    {
        "value": 786,
        "label": "BUCARASICA"
    },
    {
        "value": 787,
        "label": "CÁCOTA"
    },
    {
        "value": 788,
        "label": "CÁCHIRA"
    },
    {
        "value": 789,
        "label": "CHINÁCOTA"
    },
    {
        "value": 790,
        "label": "CHITAGÁ"
    },
    {
        "value": 791,
        "label": "CONVENCIÓN"
    },
    {
        "value": 792,
        "label": "CUCUTILLA"
    },
    {
        "value": 793,
        "label": "DURANIA"
    },
    {
        "value": 794,
        "label": "EL CARMEN"
    },
    {
        "value": 795,
        "label": "EL TARRA"
    },
    {
        "value": 796,
        "label": "EL ZULIA"
    },
    {
        "value": 797,
        "label": "GRAMALOTE"
    },
    {
        "value": 798,
        "label": "HACARÍ"
    },
    {
        "value": 799,
        "label": "HERRÁN"
    },
    {
        "value": 800,
        "label": "LABATECA"
    },
    {
        "value": 801,
        "label": "LA ESPERANZA"
    },
    {
        "value": 802,
        "label": "LA PLAYA"
    },
    {
        "value": 803,
        "label": "LOS PATIOS"
    },
    {
        "value": 804,
        "label": "LOURDES"
    },
    {
        "value": 805,
        "label": "MUTISCUA"
    },
    {
        "value": 806,
        "label": "OCAÑA"
    },
    {
        "value": 807,
        "label": "PAMPLONA"
    },
    {
        "value": 808,
        "label": "PAMPLONITA"
    },
    {
        "value": 809,
        "label": "PUERTO SANTANDER"
    },
    {
        "value": 810,
        "label": "RAGONVALIA"
    },
    {
        "value": 811,
        "label": "SALAZAR"
    },
    {
        "value": 812,
        "label": "SAN CALIXTO"
    },
    {
        "value": 813,
        "label": "SAN CAYETANO"
    },
    {
        "value": 814,
        "label": "SANTIAGO"
    },
    {
        "value": 815,
        "label": "SARDINATA"
    },
    {
        "value": 816,
        "label": "SILOS"
    },
    {
        "value": 817,
        "label": "TEORAMA"
    },
    {
        "value": 818,
        "label": "TIBÚ"
    },
    {
        "value": 819,
        "label": "TOLEDO"
    },
    {
        "value": 820,
        "label": "VILLA CARO"
    },
    {
        "value": 821,
        "label": "VILLA DEL ROSARIO"
    },
    {
        "value": 822,
        "label": "ARMENIA"
    },
    {
        "value": 823,
        "label": "BUENAVISTA"
    },
    {
        "value": 824,
        "label": "CALARCÁ"
    },
    {
        "value": 825,
        "label": "CIRCASIA"
    },
    {
        "value": 826,
        "label": "CÓRDOBA"
    },
    {
        "value": 827,
        "label": "FILANDIA"
    },
    {
        "value": 828,
        "label": "GÉNOVA"
    },
    {
        "value": 829,
        "label": "LA TEBAIDA"
    },
    {
        "value": 830,
        "label": "MONTENEGRO"
    },
    {
        "value": 831,
        "label": "PIJAO"
    },
    {
        "value": 832,
        "label": "QUIMBAYA"
    },
    {
        "value": 833,
        "label": "SALENTO"
    },
    {
        "value": 834,
        "label": "PEREIRA"
    },
    {
        "value": 835,
        "label": "APÍA"
    },
    {
        "value": 836,
        "label": "BALBOA"
    },
    {
        "value": 837,
        "label": "BELÉN DE UMBRÍA"
    },
    {
        "value": 838,
        "label": "DOSQUEBRADAS"
    },
    {
        "value": 839,
        "label": "GUÁTICA"
    },
    {
        "value": 840,
        "label": "LA CELIA"
    },
    {
        "value": 841,
        "label": "LA VIRGINIA"
    },
    {
        "value": 842,
        "label": "MARSELLA"
    },
    {
        "value": 843,
        "label": "MISTRATÓ"
    },
    {
        "value": 844,
        "label": "PUEBLO RICO"
    },
    {
        "value": 845,
        "label": "QUINCHÍA"
    },
    {
        "value": 846,
        "label": "SANTA ROSA DE CABAL"
    },
    {
        "value": 847,
        "label": "SANTUARIO"
    },
    {
        "value": 848,
        "label": "BUCARAMANGA"
    },
    {
        "value": 849,
        "label": "AGUADA"
    },
    {
        "value": 850,
        "label": "ALBANIA"
    },
    {
        "value": 851,
        "label": "ARATOCA"
    },
    {
        "value": 852,
        "label": "BARBOSA"
    },
    {
        "value": 853,
        "label": "BARICHARA"
    },
    {
        "value": 854,
        "label": "BARRANCABERMEJA"
    },
    {
        "value": 855,
        "label": "BETULIA"
    },
    {
        "value": 856,
        "label": "BOLÍVAR"
    },
    {
        "value": 857,
        "label": "CABRERA"
    },
    {
        "value": 858,
        "label": "CALIFORNIA"
    },
    {
        "value": 859,
        "label": "CAPITANEJO"
    },
    {
        "value": 860,
        "label": "CARCASÍ"
    },
    {
        "value": 861,
        "label": "CEPITÁ"
    },
    {
        "value": 862,
        "label": "CERRITO"
    },
    {
        "value": 863,
        "label": "CHARALÁ"
    },
    {
        "value": 864,
        "label": "CHARTA"
    },
    {
        "value": 865,
        "label": "CHIMA"
    },
    {
        "value": 866,
        "label": "CHIPATÁ"
    },
    {
        "value": 867,
        "label": "CIMITARRA"
    },
    {
        "value": 868,
        "label": "CONCEPCIÓN"
    },
    {
        "value": 869,
        "label": "CONFINES"
    },
    {
        "value": 870,
        "label": "CONTRATACIÓN"
    },
    {
        "value": 871,
        "label": "COROMORO"
    },
    {
        "value": 872,
        "label": "CURITÍ"
    },
    {
        "value": 873,
        "label": "EL CARMEN DE CHUCURÍ"
    },
    {
        "value": 874,
        "label": "EL GUACAMAYO"
    },
    {
        "value": 875,
        "label": "EL PEÑÓN"
    },
    {
        "value": 876,
        "label": "EL PLAYÓN"
    },
    {
        "value": 877,
        "label": "ENCINO"
    },
    {
        "value": 878,
        "label": "ENCISO"
    },
    {
        "value": 879,
        "label": "FLORIÁN"
    },
    {
        "value": 880,
        "label": "FLORIDABLANCA"
    },
    {
        "value": 881,
        "label": "GALÁN"
    },
    {
        "value": 882,
        "label": "GÁMBITA"
    },
    {
        "value": 883,
        "label": "GIRÓN"
    },
    {
        "value": 884,
        "label": "GUACA"
    },
    {
        "value": 885,
        "label": "GUADALUPE"
    },
    {
        "value": 886,
        "label": "GUAPOTÁ"
    },
    {
        "value": 887,
        "label": "GUAVATÁ"
    },
    {
        "value": 888,
        "label": "GÜEPSA"
    },
    {
        "value": 889,
        "label": "HATO"
    },
    {
        "value": 890,
        "label": "JESÚS MARÍA"
    },
    {
        "value": 891,
        "label": "JORDÁN"
    },
    {
        "value": 892,
        "label": "LA BELLEZA"
    },
    {
        "value": 893,
        "label": "LANDÁZURI"
    },
    {
        "value": 894,
        "label": "LA PAZ"
    },
    {
        "value": 895,
        "label": "LEBRIJA"
    },
    {
        "value": 896,
        "label": "LOS SANTOS"
    },
    {
        "value": 897,
        "label": "MACARAVITA"
    },
    {
        "value": 898,
        "label": "MÁLAGA"
    },
    {
        "value": 899,
        "label": "MATANZA"
    },
    {
        "value": 900,
        "label": "MOGOTES"
    },
    {
        "value": 901,
        "label": "MOLAGAVITA"
    },
    {
        "value": 902,
        "label": "OCAMONTE"
    },
    {
        "value": 903,
        "label": "OIBA"
    },
    {
        "value": 904,
        "label": "ONZAGA"
    },
    {
        "value": 905,
        "label": "PALMAR"
    },
    {
        "value": 906,
        "label": "PALMAS DEL SOCORRO"
    },
    {
        "value": 907,
        "label": "PÁRAMO"
    },
    {
        "value": 908,
        "label": "PIEDECUESTA"
    },
    {
        "value": 909,
        "label": "PINCHOTE"
    },
    {
        "value": 910,
        "label": "PUENTE NACIONAL"
    },
    {
        "value": 911,
        "label": "PUERTO PARRA"
    },
    {
        "value": 912,
        "label": "PUERTO WILCHES"
    },
    {
        "value": 913,
        "label": "RIONEGRO"
    },
    {
        "value": 914,
        "label": "SABANA DE TORRES"
    },
    {
        "value": 915,
        "label": "SAN ANDRÉS"
    },
    {
        "value": 916,
        "label": "SAN BENITO"
    },
    {
        "value": 917,
        "label": "SAN GIL"
    },
    {
        "value": 918,
        "label": "SAN JOAQUÍN"
    },
    {
        "value": 919,
        "label": "SAN JOSÉ DE MIRANDA"
    },
    {
        "value": 920,
        "label": "SAN MIGUEL"
    },
    {
        "value": 921,
        "label": "SAN VICENTE DE CHUCURÍ"
    },
    {
        "value": 922,
        "label": "SANTA BÁRBARA"
    },
    {
        "value": 923,
        "label": "SANTA HELENA DEL OPÓN"
    },
    {
        "value": 924,
        "label": "SIMACOTA"
    },
    {
        "value": 925,
        "label": "SOCORRO"
    },
    {
        "value": 926,
        "label": "SUAITA"
    },
    {
        "value": 927,
        "label": "SUCRE"
    },
    {
        "value": 928,
        "label": "SURATÁ"
    },
    {
        "value": 929,
        "label": "TONA"
    },
    {
        "value": 930,
        "label": "VALLE DE SAN JOSÉ"
    },
    {
        "value": 931,
        "label": "VÉLEZ"
    },
    {
        "value": 932,
        "label": "VETAS"
    },
    {
        "value": 933,
        "label": "VILLANUEVA"
    },
    {
        "value": 934,
        "label": "ZAPATOCA"
    },
    {
        "value": 935,
        "label": "SINCELEJO"
    },
    {
        "value": 936,
        "label": "BUENAVISTA"
    },
    {
        "value": 937,
        "label": "CAIMITO"
    },
    {
        "value": 938,
        "label": "COLOSÓ"
    },
    {
        "value": 939,
        "label": "COROZAL"
    },
    {
        "value": 940,
        "label": "COVEÑAS"
    },
    {
        "value": 941,
        "label": "CHALÁN"
    },
    {
        "value": 942,
        "label": "EL ROBLE"
    },
    {
        "value": 943,
        "label": "GALERAS"
    },
    {
        "value": 944,
        "label": "GUARANDA"
    },
    {
        "value": 945,
        "label": "LA UNIÓN"
    },
    {
        "value": 946,
        "label": "LOS PALMITOS"
    },
    {
        "value": 947,
        "label": "MAJAGUAL"
    },
    {
        "value": 948,
        "label": "MORROA"
    },
    {
        "value": 949,
        "label": "OVEJAS"
    },
    {
        "value": 950,
        "label": "PALMITO"
    },
    {
        "value": 951,
        "label": "SAMPUÉS"
    },
    {
        "value": 952,
        "label": "SAN BENITO ABAD"
    },
    {
        "value": 953,
        "label": "SAN JUAN DE BETULIA"
    },
    {
        "value": 954,
        "label": "SAN MARCOS"
    },
    {
        "value": 955,
        "label": "SAN ONOFRE"
    },
    {
        "value": 956,
        "label": "SAN PEDRO"
    },
    {
        "value": 957,
        "label": "SAN LUIS DE SINCÉ"
    },
    {
        "value": 958,
        "label": "SUCRE"
    },
    {
        "value": 959,
        "label": "SANTIAGO DE TOLÚ"
    },
    {
        "value": 960,
        "label": "TOLÚ VIEJO"
    },
    {
        "value": 961,
        "label": "IBAGUÉ"
    },
    {
        "value": 962,
        "label": "ALPUJARRA"
    },
    {
        "value": 963,
        "label": "ALVARADO"
    },
    {
        "value": 964,
        "label": "AMBALEMA"
    },
    {
        "value": 965,
        "label": "ANZOÁTEGUI"
    },
    {
        "value": 966,
        "label": "ARMERO"
    },
    {
        "value": 967,
        "label": "ATACO"
    },
    {
        "value": 968,
        "label": "CAJAMARCA"
    },
    {
        "value": 969,
        "label": "CARMEN DE APICALÁ"
    },
    {
        "value": 970,
        "label": "CASABIANCA"
    },
    {
        "value": 971,
        "label": "CHAPARRAL"
    },
    {
        "value": 972,
        "label": "COELLO"
    },
    {
        "value": 973,
        "label": "COYAIMA"
    },
    {
        "value": 974,
        "label": "CUNDAY"
    },
    {
        "value": 975,
        "label": "DOLORES"
    },
    {
        "value": 976,
        "label": "ESPINAL"
    },
    {
        "value": 977,
        "label": "FALAN"
    },
    {
        "value": 978,
        "label": "FLANDES"
    },
    {
        "value": 979,
        "label": "FRESNO"
    },
    {
        "value": 980,
        "label": "GUAMO"
    },
    {
        "value": 981,
        "label": "HERVEO"
    },
    {
        "value": 982,
        "label": "HONDA"
    },
    {
        "value": 983,
        "label": "ICONONZO"
    },
    {
        "value": 984,
        "label": "LÉRIDA"
    },
    {
        "value": 985,
        "label": "LÍBANO"
    },
    {
        "value": 986,
        "label": "SAN SEBASTIÁN DE MARIQUITA"
    },
    {
        "value": 987,
        "label": "MELGAR"
    },
    {
        "value": 988,
        "label": "MURILLO"
    },
    {
        "value": 989,
        "label": "NATAGAIMA"
    },
    {
        "value": 990,
        "label": "ORTEGA"
    },
    {
        "value": 991,
        "label": "PALOCABILDO"
    },
    {
        "value": 992,
        "label": "PIEDRAS"
    },
    {
        "value": 993,
        "label": "PLANADAS"
    },
    {
        "value": 994,
        "label": "PRADO"
    },
    {
        "value": 995,
        "label": "PURIFICACIÓN"
    },
    {
        "value": 996,
        "label": "RIOBLANCO"
    },
    {
        "value": 997,
        "label": "RONCESVALLES"
    },
    {
        "value": 998,
        "label": "ROVIRA"
    },
    {
        "value": 999,
        "label": "SALDAÑA"
    },
    {
        "value": 1000,
        "label": "SAN ANTONIO"
    },
    {
        "value": 1001,
        "label": "SAN LUIS"
    },
    {
        "value": 1002,
        "label": "SANTA ISABEL"
    },
    {
        "value": 1003,
        "label": "SUÁREZ"
    },
    {
        "value": 1004,
        "label": "VALLE DE SAN JUAN"
    },
    {
        "value": 1005,
        "label": "VENADILLO"
    },
    {
        "value": 1006,
        "label": "VILLAHERMOSA"
    },
    {
        "value": 1007,
        "label": "VILLARRICA"
    },
    {
        "value": 1008,
        "label": "CALI"
    },
    {
        "value": 1009,
        "label": "ALCALÁ"
    },
    {
        "value": 1010,
        "label": "ANDALUCÍA"
    },
    {
        "value": 1011,
        "label": "ANSERMANUEVO"
    },
    {
        "value": 1012,
        "label": "ARGELIA"
    },
    {
        "value": 1013,
        "label": "BOLÍVAR"
    },
    {
        "value": 1014,
        "label": "BUENAVENTURA"
    },
    {
        "value": 1015,
        "label": "GUADALAJARA DE BUGA"
    },
    {
        "value": 1016,
        "label": "BUGALAGRANDE"
    },
    {
        "value": 1017,
        "label": "CAICEDONIA"
    },
    {
        "value": 1018,
        "label": "CALIMA"
    },
    {
        "value": 1019,
        "label": "CANDELARIA"
    },
    {
        "value": 1020,
        "label": "CARTAGO"
    },
    {
        "value": 1021,
        "label": "DAGUA"
    },
    {
        "value": 1022,
        "label": "EL ÁGUILA"
    },
    {
        "value": 1023,
        "label": "EL CAIRO"
    },
    {
        "value": 1024,
        "label": "EL CERRITO"
    },
    {
        "value": 1025,
        "label": "EL DOVIO"
    },
    {
        "value": 1026,
        "label": "FLORIDA"
    },
    {
        "value": 1027,
        "label": "GINEBRA"
    },
    {
        "value": 1028,
        "label": "GUACARÍ"
    },
    {
        "value": 1029,
        "label": "JAMUNDÍ"
    },
    {
        "value": 1030,
        "label": "LA CUMBRE"
    },
    {
        "value": 1031,
        "label": "LA UNIÓN"
    },
    {
        "value": 1032,
        "label": "LA VICTORIA"
    },
    {
        "value": 1033,
        "label": "OBANDO"
    },
    {
        "value": 1034,
        "label": "PALMIRA"
    },
    {
        "value": 1035,
        "label": "PRADERA"
    },
    {
        "value": 1036,
        "label": "RESTREPO"
    },
    {
        "value": 1037,
        "label": "RIOFRÍO"
    },
    {
        "value": 1038,
        "label": "ROLDANILLO"
    },
    {
        "value": 1039,
        "label": "SAN PEDRO"
    },
    {
        "value": 1040,
        "label": "SEVILLA"
    },
    {
        "value": 1041,
        "label": "TORO"
    },
    {
        "value": 1042,
        "label": "TRUJILLO"
    },
    {
        "value": 1043,
        "label": "TULUÁ"
    },
    {
        "value": 1044,
        "label": "ULLOA"
    },
    {
        "value": 1045,
        "label": "VERSALLES"
    },
    {
        "value": 1046,
        "label": "VIJES"
    },
    {
        "value": 1047,
        "label": "YOTOCO"
    },
    {
        "value": 1048,
        "label": "YUMBO"
    },
    {
        "value": 1049,
        "label": "ZARZAL"
    },
    {
        "value": 1050,
        "label": "ARAUCA"
    },
    {
        "value": 1051,
        "label": "ARAUQUITA"
    },
    {
        "value": 1052,
        "label": "CRAVO NORTE"
    },
    {
        "value": 1053,
        "label": "FORTUL"
    },
    {
        "value": 1054,
        "label": "PUERTO RONDÓN"
    },
    {
        "value": 1055,
        "label": "SARAVENA"
    },
    {
        "value": 1056,
        "label": "TAME"
    },
    {
        "value": 1057,
        "label": "YOPAL"
    },
    {
        "value": 1058,
        "label": "AGUAZUL"
    },
    {
        "value": 1059,
        "label": "CHÁMEZA"
    },
    {
        "value": 1060,
        "label": "HATO COROZAL"
    },
    {
        "value": 1061,
        "label": "LA SALINA"
    },
    {
        "value": 1062,
        "label": "MANÍ"
    },
    {
        "value": 1063,
        "label": "MONTERREY"
    },
    {
        "value": 1064,
        "label": "NUNCHÍA"
    },
    {
        "value": 1065,
        "label": "OROCUÉ"
    },
    {
        "value": 1066,
        "label": "PAZ DE ARIPORO"
    },
    {
        "value": 1067,
        "label": "PORE"
    },
    {
        "value": 1068,
        "label": "RECETOR"
    },
    {
        "value": 1069,
        "label": "SABANALARGA"
    },
    {
        "value": 1070,
        "label": "SÁCAMA"
    },
    {
        "value": 1071,
        "label": "SAN LUIS DE PALENQUE"
    },
    {
        "value": 1072,
        "label": "TÁMARA"
    },
    {
        "value": 1073,
        "label": "TAURAMENA"
    },
    {
        "value": 1074,
        "label": "TRINIDAD"
    },
    {
        "value": 1075,
        "label": "VILLANUEVA"
    },
    {
        "value": 1076,
        "label": "MOCOA"
    },
    {
        "value": 1077,
        "label": "COLÓN"
    },
    {
        "value": 1078,
        "label": "ORITO"
    },
    {
        "value": 1079,
        "label": "PUERTO ASÍS"
    },
    {
        "value": 1080,
        "label": "PUERTO CAICEDO"
    },
    {
        "value": 1081,
        "label": "PUERTO GUZMÁN"
    },
    {
        "value": 1082,
        "label": "PUERTO LEGUÍZAMO"
    },
    {
        "value": 1083,
        "label": "SIBUNDOY"
    },
    {
        "value": 1084,
        "label": "SAN FRANCISCO"
    },
    {
        "value": 1085,
        "label": "SAN MIGUEL"
    },
    {
        "value": 1086,
        "label": "SANTIAGO"
    },
    {
        "value": 1087,
        "label": "VALLE DEL GUAMUEZ"
    },
    {
        "value": 1088,
        "label": "VILLAGARZÓN"
    },
    {
        "value": 1089,
        "label": "SAN ANDRÉS"
    },
    {
        "value": 1090,
        "label": "PROVIDENCIA"
    },
    {
        "value": 1091,
        "label": "LETICIA"
    },
    {
        "value": 1092,
        "label": "EL ENCANTO"
    },
    {
        "value": 1093,
        "label": "LA CHORRERA"
    },
    {
        "value": 1094,
        "label": "LA PEDRERA"
    },
    {
        "value": 1095,
        "label": "LA VICTORIA"
    },
    {
        "value": 1096,
        "label": "MIRITÍ - PARANÁ"
    },
    {
        "value": 1097,
        "label": "PUERTO ALEGRÍA"
    },
    {
        "value": 1098,
        "label": "PUERTO ARICA"
    },
    {
        "value": 1099,
        "label": "PUERTO NARIÑO"
    },
    {
        "value": 1100,
        "label": "PUERTO SANTANDER"
    },
    {
        "value": 1101,
        "label": "TARAPACÁ"
    },
    {
        "value": 1102,
        "label": "INÍRIDA"
    },
    {
        "value": 1103,
        "label": "BARRANCO MINAS"
    },
    {
        "value": 1104,
        "label": "MAPIRIPANA"
    },
    {
        "value": 1105,
        "label": "SAN FELIPE"
    },
    {
        "value": 1106,
        "label": "PUERTO COLOMBIA"
    },
    {
        "value": 1107,
        "label": "LA GUADALUPE"
    },
    {
        "value": 1108,
        "label": "CACAHUAL"
    },
    {
        "value": 1109,
        "label": "PANA PANA"
    },
    {
        "value": 1110,
        "label": "MORICHAL"
    },
    {
        "value": 1111,
        "label": "SAN JOSÉ DEL GUAVIARE"
    },
    {
        "value": 1112,
        "label": "CALAMAR"
    },
    {
        "value": 1113,
        "label": "EL RETORNO"
    },
    {
        "value": 1114,
        "label": "MIRAFLORES"
    },
    {
        "value": 1115,
        "label": "MITÚ"
    },
    {
        "value": 1116,
        "label": "CARURÚ"
    },
    {
        "value": 1117,
        "label": "PACOA"
    },
    {
        "value": 1118,
        "label": "TARAIRA"
    },
    {
        "value": 1119,
        "label": "PAPUNAHUA"
    },
    {
        "value": 1120,
        "label": "YAVARATÉ"
    },
    {
        "value": 1121,
        "label": "PUERTO CARREÑO\t"
    },
    {
        "value": 1122,
        "label": "LA PRIMAVERA\t"
    },
    {
        "value": 1123,
        "label": "SANTA ROSALÍA\t"
    },
    {
        "value": 1124,
        "label": "CUMARIBO\t"
    }
];

export default Ciudades;