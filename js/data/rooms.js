window.Game = window.Game || {};

// Nombres oficiales de las 5 secciones periciales
window.Game.ROOM_NAMES = {
    1: "OFICINA DE SOPORTE",
    2: "NÚCLEO DE SERVIDORES",
    3: "ÁREA FINANCIERA",
    4: "CENTRAL DE COMUNICACIONES",
    5: "LABORATORIO DE SOFTWARE"
};

// Diseños arquitectónicos de las 5 salas periciales en plano amplio (1160 x 740)
// Con pasillos mínimos de 90px libres, mamparas de oficina y mobiliario ampliado
window.Game.ROOM_LAYOUTS = {
    1: {
        desks: [
            {
                x: 180, y: 110, width: 160, label: "PUESTO 01",
                clueType: "computer",
                clue: "Log de acceso: el usuario 'soporte_04' excedió su autorización e ingresó al panel administrativo usando la contraseña retenida de un supervisor. No dañó archivos ni instaló virus."
            },
            {
                x: 480, y: 110, width: 160, label: "PUESTO 02",
                clueType: "document",
                clue: "Extracto (Art. 6): quien sin autorización o excediendo la que hubiere obtenido acceda, intercepte, interfiera o use un sistema recibe 1 a 5 años de prisión y multa de 10 a 50 UT."
            },
            {
                x: 360, y: 530, width: 170, label: "ANALISTA",
                clueType: "computer",
                clue: "Informe de auditoría (Arts. 27 y 29): usar contraseña ajena retenida y abusar del cargo aumenta la pena de 1/3 a 1/2, y habilita penas accesorias de trabajo comunitario o inhabilitación profesional hasta por 3 años."
            }
        ],
        racks: [
            { x: 930, y: 100, label: "RACK A" },
            { x: 930, y: 480, label: "RACK B" }
        ],
        plants: [
            { x: 70, y: 120 },
            { x: 70, y: 570 },
            { x: 820, y: 580 }
        ],
        walls: [
            { x: 390, y: 70, width: 14, height: 150 },
            { x: 270, y: 490, width: 14, height: 160 }
        ],
        decor: [
            { type: "cabinet", x: 740, y: 100, width: 68, height: 42, label: "ARCHIVOS" },
            { type: "table", x: 680, y: 530, width: 90, height: 50, label: "RECEPCIÓN" }
        ]
    },
    2: {
        desks: [
            {
                x: 160, y: 110, width: 180, label: "SEGURIDAD",
                clueType: "computer",
                clue: "Análisis forense: el atacante introdujo de forma intencional un programa indeseado que se propagó sin control e inutilizó los servidores (definición de virus en Art. 2)."
            },
            {
                x: 540, y: 110, width: 180, label: "MONITOREO",
                clueType: "document",
                clue: "Descarte de culpa (Art. 8): no hubo imprudencia, negligencia ni impericia. La introducción intencional de virus eleva el sabotaje del Art. 7 a 5–10 años de prisión y 500–1.000 UT."
            },
            {
                x: 160, y: 530, width: 180, label: "INCIDENTES",
                clueType: "document",
                clue: "Ficha de infraestructura: estos servidores cuentan con medidas de seguridad activas y alojan data personal y patrimonial de clientes naturales y jurídicos."
            },
            {
                x: 540, y: 530, width: 180, label: "ANÁLISIS",
                clueType: "computer",
                clue: "Regla de sistemas protegidos (Art. 9): cuando el sabotaje recae sobre un sistema protegido con información personal o patrimonial, las penas se aumentan entre una tercera parte y la mitad."
            }
        ],
        racks: [
            { x: 910, y: 90, label: "NODO 01" },
            { x: 910, y: 270, label: "NODO 02" },
            { x: 910, y: 510, label: "NODO 03" }
        ],
        plants: [
            { x: 70, y: 130 },
            { x: 70, y: 560 }
        ],
        walls: [
            { x: 830, y: 70, width: 14, height: 180 },
            { x: 830, y: 460, width: 14, height: 180 }
        ],
        decor: [
            { type: "terminal_bench", x: 380, y: 325, width: 80, height: 50, label: "TELEMETRÍA" }
        ]
    },
    3: {
        desks: [
            {
                x: 210, y: 110, width: 170, label: "TESORERÍA",
                clueType: "computer",
                clue: "Traza contable: un operador manipuló el módulo de pagos e insertó instrucciones falsas para desviar fondos en provecho injusto y perjuicio de la empresa."
            },
            {
                x: 560, y: 110, width: 170, label: "PAGOS",
                clueType: "document",
                clue: "Descarte técnico: no hubo clonación ni alteración de tarjetas inteligentes (Art. 16: 5–10 años y 500–1.000 UT) ni simple sustracción sin instrucciones falsas (Art. 13)."
            },
            {
                x: 370, y: 530, width: 180, label: "AUDITORÍA",
                clueType: "document",
                clue: "Base legal (Arts. 14 y 31): insertar instrucciones falsas con provecho injusto en perjuicio ajeno es fraude (3 a 7 años y 300 a 700 UT). Por ser Capítulo II, aplica indemnización civil fijada con auxilio de expertos."
            }
        ],
        racks: [
            { x: 920, y: 110, label: "CORE A" },
            { x: 920, y: 490, label: "CORE B" }
        ],
        plants: [
            { x: 70, y: 120 },
            { x: 70, y: 570 },
            { x: 810, y: 120 }
        ],
        walls: [
            { x: 440, y: 70, width: 14, height: 160 },
            { x: 620, y: 490, width: 14, height: 160 }
        ],
        decor: [
            { type: "meeting_table", x: 670, y: 315, width: 110, height: 56, label: "JUNTA" },
            { type: "vault", x: 70, y: 220, width: 50, height: 45, label: "BÓVEDA" }
        ]
    },
    4: {
        desks: [
            {
                x: 170, y: 110, width: 175, label: "CORREO",
                clueType: "computer",
                clue: "Captura de red: se interceptaron mensajes de datos de comunicaciones ajenas (Art. 21: 2 a 6 años y 200 a 600 UT) y luego se difundió su contenido (Art. 22)."
            },
            {
                x: 510, y: 110, width: 175, label: "GERENCIA",
                clueType: "document",
                clue: "Acta corporativa (Art. 5): el hecho fue ejecutado por decisión de los órganos directivos de la empresa, usando recursos sociales y en su interés."
            },
            {
                x: 170, y: 530, width: 175, label: "REDES",
                clueType: "computer",
                clue: "Rastro financiero (Art. 22): la revelación o cesión de la data interceptada se hizo con fin de lucro, lo cual aumenta la pena de 1/3 a 1/2."
            },
            {
                x: 510, y: 530, width: 175, label: "LEGAL",
                clueType: "document",
                clue: "Sanción corporativa (Arts. 28 y 29): a la persona jurídica corresponde únicamente multa por el doble del monto del delito, y puede imponerse suspensión de permisos o cargos directivos hasta por 3 años."
            }
        ],
        racks: [
            { x: 900, y: 110, label: "ENLACE 01" },
            { x: 900, y: 490, label: "ENLACE 02" }
        ],
        plants: [
            { x: 70, y: 110 },
            { x: 70, y: 570 },
            { x: 770, y: 320 }
        ],
        walls: [
            { x: 400, y: 300, width: 18, height: 80 }
        ],
        decor: [
            { type: "cabinet", x: 760, y: 110, width: 70, height: 45, label: "PROXY 01" },
            { type: "cabinet", x: 760, y: 530, width: 70, height: 45, label: "PROXY 02" }
        ]
    },
    5: {
        desks: [
            {
                x: 540, y: 110, width: 180, label: "REPOSITORIO",
                clueType: "computer",
                clue: "Evidencia de código: un líder técnico abusó de su posición privilegiada de acceso para copiar y distribuir sin autorización el software propietario de la empresa con fin de provecho económico."
            },
            {
                x: 540, y: 530, width: 180, label: "PROPIEDAD",
                clueType: "document",
                clue: "Capítulo V (Art. 25): reproducir, copiar, distribuir o divulgar un software obtenido desde un sistema sin autorización y con fin económico conlleva 1 a 5 años de prisión y multa de 100 a 500 UT."
            },
            {
                x: 820, y: 320, width: 170, label: "DICTAMEN",
                clueType: "document",
                clue: "Consecuencias acumuladas (Arts. 27, 29 y 31): por abuso de cargo sube la pena de 1/3 a 1/2 con posible inhabilitación profesional hasta 3 años, y por ser Capítulo V el juez impone indemnización civil con auxilio de expertos."
            }
        ],
        racks: [
            { x: 180, y: 90, label: "DEV 01" },
            { x: 270, y: 90, label: "DEV 02" },
            { x: 180, y: 490, label: "DEV 03" },
            { x: 270, y: 490, label: "DEV 04" }
        ],
        plants: [
            { x: 70, y: 110 },
            { x: 70, y: 570 },
            { x: 1040, y: 110 }
        ],
        walls: [
            { x: 400, y: 70, width: 14, height: 180 },
            { x: 400, y: 440, width: 14, height: 180 }
        ],
        decor: [
            { type: "table", x: 760, y: 110, width: 90, height: 48, label: "TESTBENCH" }
        ]
    }
};
