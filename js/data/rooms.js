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
// Con pasillos mínimos garantizados >= 76px libres, mamparas de oficina y mobiliario ampliado HD
window.Game.ROOM_LAYOUTS = {
    // =========================================================================
    // SALA 1 — OFICINA DE SOPORTE
    // Recepción en la entrada (emblema CICPC), pasillo central que divide 3
    // cubículos en "L" con mamparas y cuarto de archivo al fondo con puerta abierta.
    // =========================================================================
    1: {
        desks: [
            {
                x: 150, y: 80, width: 150, label: "PUESTO 01",
                clueType: "computer",
                clue: "Registro del Syslog del servidor central: A las 22:14 hrs, la sesión 'soporte_04' escaló permisos hacia el panel de gestión raíz de la infraestructura. La auditoría de integridad constató que no se alteró la lógica de los servicios, no se inyectó código malicioso ni se borraron archivos del sistema."
            },
            {
                x: 440, y: 80, width: 150, label: "PUESTO 02",
                clueType: "document",
                clue: "Volcado de memoria del enrutador y tabla de sesiones: Se verificó una interacción activa no autorizada con los módulos internos de configuración. El análisis forense descartó descarga de bases de datos, forja de firmas probatorias o transmisión de secretos de Estado hacia el exterior; la conducta se limitó a penetrar y usar el entorno restringido sin contar con habilitación."
            },
            {
                x: 400, y: 540, width: 160, label: "ANALISTA",
                clueType: "computer",
                clue: "Expediente del departamento de talento humano: El operador 'soporte_04' se valió de una credencial alfanumérica confidencial asignada originalmente a un supervisor desvinculado de la empresa hace dos meses, cuya contraseña no fue revocada en los registros. El investigado aprovechó sus funciones ordinarias de mesa de ayuda técnica para ejecutar la intrusión."
            }
        ],
        racks: [
            { x: 970, y: 490, label: "RACK SOPORTE" }
        ],
        plants: [
            { x: 50, y: 100 },
            { x: 50, y: 620 },
            { x: 720, y: 620 }
        ],
        walls: [
            // Cubículo 1 / 2 (L norte)
            { x: 350, y: 22, width: 14, height: 170 },
            { x: 350, y: 192, width: 130, height: 14 },
            // Cubículo 3 (L sur)
            { x: 330, y: 490, width: 14, height: 228 },
            { x: 330, y: 476, width: 140, height: 14 },
            // Cuarto de archivo cerrado con puerta abierta de 90px de luz
            { x: 780, y: 22, width: 14, height: 220 },
            { x: 780, y: 242, width: 100, height: 14 },
            { x: 970, y: 242, width: 130, height: 14 }
        ],
        decor: [
            { type: "table", propType: "table", x: 180, y: 320, width: 90, height: 48, label: "RECEPCIÓN" },
            // Objeto de ruido 1: Impresora en pasillo central
            {
                propType: "printer",
                x: 600, y: 320, width: 50, height: 44,
                label: "IMPRESORA 01",
                isNoise: true,
                clueType: "document",
                title: "Impresora Multifunción: Reporte de Tóner",
                clue: "Reporte de autodiagnóstico: Nivel de tóner negro al 88%, tóner cian al 92%, bandeja principal con 200 hojas bond formato carta. Último trabajo en cola: 'Turnos_Soporte_Semana.pdf', emitido a las 17:45 hrs desde la estación local de recepción."
            },
            // Objeto de ruido 2: Archivador en cuarto de archivo cerrado
            {
                propType: "filingCabinet",
                x: 820, y: 70, width: 46, height: 44,
                label: "FACTURAS",
                isNoise: true,
                clueType: "document",
                title: "Archivador Metálico: Facturas de Papelería",
                clue: "Expediente administrativo de compras: Comprobantes de pago y facturas comerciales canceladas por concepto de resmas de papel bond, carpetas manila, tóner láser y consumibles de oficina correspondientes al primer trimestre del año."
            },
            // Mobiliario auxiliar en archivo
            {
                propType: "evidenceBox",
                x: 990, y: 70, width: 44, height: 38,
                label: "SUMINISTROS"
            }
        ]
    },

    // =========================================================================
    // SALA 2 — NÚCLEO DE SERVIDORES
    // Distribución de "jaula fría" con dos pasillos paralelos amplios entre filas
    // de racks de servidores, más cabina de monitoreo acristalada en el extremo oeste.
    // =========================================================================
    2: {
        doorCode: "2048",
        desks: [
            {
                x: 80, y: 80, width: 160, label: "SEGURIDAD",
                clueType: "computer",
                clue: "Informe de telemetría del Kernel y sistema de archivos: A las 03:22 hrs se ejecutó un script en segundo plano que desplegó un segmento de código autónomo. El programa se propagó sin control por la matriz de almacenamiento, corrompiendo tablas maestras e inutilizando de forma irreversible la operatividad de los servidores centrales."
            },
            {
                x: 80, y: 550, width: 160, label: "MONITOREO",
                clueType: "document",
                clue: "Desensamblado de binarios y auditoría forense del atacante: El peritaje técnico comprobó que el código fue compilado de manera deliberada con rutinas orientadas a la destrucción y bloqueo masivo de procesos. El análisis de tráfico y bitácoras de consola descartó fallas operativas involuntarias, negligencia de turno o impericia del personal de administración."
            },
            {
                x: 500, y: 310, width: 160, label: "INCIDENTES",
                clueType: "document",
                clue: "Inventario de activos tecnológicos de la corporación: El clúster de servidores afectado cuenta con cortafuegos perimetrales redundantes, cifrado de volumen activo y autenticación multifactor. Las particiones dañadas alojan repositorios de historiales clínicos, registros de identidad y estados patrimoniales de personas naturales y clientes corporativos."
            },
            {
                x: 740, y: 310, width: 160, label: "ANÁLISIS",
                clueType: "computer",
                clue: "Acta de inspección de seguridad pericial: Los sistemas destruidos constituyen el núcleo de resguardo de datos personales y comerciales protegidos por estrictos protocolos de custodia de la organización. El peritaje confirmó que la vulneración recayó directamente sobre un entorno dotado de mecanismos activos de protección institucional."
            }
        ],
        racks: [
            // Fila Norte
            { x: 460, y: 80, label: "SRV-A1" },
            { x: 600, y: 80, label: "SRV-A2" },
            { x: 740, y: 80, label: "SRV-A3" },
            { x: 880, y: 80, label: "SRV-A4" },
            // Fila Sur
            { x: 460, y: 530, label: "SRV-B1" },
            { x: 600, y: 530, label: "SRV-B2" },
            { x: 740, y: 530, label: "SRV-B3" },
            { x: 880, y: 530, label: "SRV-B4" }
        ],
        plants: [
            { x: 410, y: 620 },
            { x: 1050, y: 620 }
        ],
        walls: [
            // Pared divisoria de la cabina de monitoreo acristalada (con acceso libre de 160px)
            { x: 370, y: 22, width: 14, height: 260 },
            { x: 370, y: 440, width: 14, height: 278 }
        ],
        decor: [
            // Objeto de ruido 1: Impresora en cabina de monitoreo
            {
                propType: "printer",
                x: 270, y: 80, width: 50, height: 44,
                label: "LOGGER",
                isNoise: true,
                clueType: "document",
                title: "Impresora Matricial: Log de Respaldo",
                clue: "Registro impreso de consola de respaldo: Tarea programada 'backup_incremental_nomina' iniciada a las 02:00:15 hrs y finalizada a las 02:24:40 hrs. Total de bloques procesados: 48.210 MB. Código de salida: 0 (Ejecución satisfactoria)."
            },
            // Objeto de ruido 2: Unidad HVAC / Climatización industrial de servidores
            {
                propType: "acUnit",
                x: 1020, y: 180, width: 58, height: 50,
                label: "HVAC CLIMA",
                isNoise: true,
                clueType: "computer",
                title: "Unidad HVAC: Telemetría Ambiental",
                clue: "Panel de control ambiental de jaula fría: Temperatura de inyección en 17.5 °C, temperatura de retorno en 21.2 °C, humedad relativa al 45%. Suministro de energía ininterrumpida en línea nominal a 220V / 60Hz, sin caídas de tensión ni alertas de condensación."
            },
            // Objeto de ruido 3: Nota arrugada (Archivo técnico) con código sutil
            {
                propType: "filingCabinet",
                x: 1020, y: 440, width: 44, height: 44,
                label: "ARCHIVO",
                isNoise: true,
                clueType: "oldNote",
                title: "Nota arrugada (Archivo técnico)",
                clue: "De: Téc. Morales (2023). Si el supervisor vuelve a preguntar por qué se reinició el rack 4, dile que fue la bajada de tensión del martes. Por cierto, cambié la clave del panel de salida porque la anterior se la sabía hasta el vigilante; dejé lo mismo que la capacidad en megas del primer servidor que monté aquí en 2011, el famoso 2048. No lo anotes en la pizarra."
            }
        ]
    },

    // =========================================================================
    // SALA 3 — ÁREA FINANCIERA
    // Vestíbulo de control, sala de juntas central con mesa grande, despacho
    // gerencial compartimentado y rincón de bóveda/caja fuerte con lectoras.
    // =========================================================================
    3: {
        doorCode: "8415",
        desks: [
            {
                x: 780, y: 80, width: 160, label: "TESORERÍA",
                clueType: "computer",
                clue: "Traza del módulo de procesamiento de pagos: Se detectó la inserción clandestina de líneas de instrucciones y comandos contables adulterados dentro del algoritmo transaccional. La manipulación desvió lotes de transferencias interbancarias hacia cuentas no autorizadas en beneficio económico de los implicados."
            },
            {
                x: 740, y: 550, width: 150, label: "PAGOS",
                clueType: "document",
                clue: "Dictamen de laboratorio forense de medios de pago: La experticia determinó que no existió sustracción física de efectivo de cajas de seguridad ni clonación, forja o alteración de bandas magnéticas o microchips de tarjetas plásticas inteligentes de clientes; el desvío patrimonial se consumó exclusivamente mediante la alteración de datos e inserción de instrucciones falsas en el sistema informático."
            },
            {
                x: 930, y: 550, width: 150, label: "AUDITORÍA",
                clueType: "document",
                clue: "Balance pericial contable de auditoría externa: El desvío de fondos ocasionó un perjuicio patrimonial directo tasado preliminarmente en pérdidas financieras sustanciales en detrimento de la compañía. El informe fiscal deja constancia de la necesidad de fijar la cuantía resarcitoria definitiva mediante la intervención formal de expertos tasadores designados por el tribunal."
            }
        ],
        racks: [
            { x: 1040, y: 310, label: "CORE FINANZAS" }
        ],
        plants: [
            { x: 50, y: 620 },
            { x: 720, y: 620 }
        ],
        walls: [
            // Separador del vestíbulo de control (paso libre central de 160px)
            { x: 280, y: 22, width: 14, height: 260 },
            { x: 280, y: 440, width: 14, height: 278 },
            // Rincón reforzado de la bóveda
            { x: 20, y: 200, width: 170, height: 14 },
            // Sala de juntas central (particiones norte y sur con amplias entradas laterales)
            { x: 340, y: 200, width: 330, height: 14 },
            { x: 340, y: 520, width: 330, height: 14 },
            // Despacho gerencial
            { x: 720, y: 22, width: 14, height: 210 }
        ],
        decor: [
            // Mesa de recepción de control en vestíbulo (desplazada fuera del área de spawn)
            { type: "table", propType: "table", x: 130, y: 220, width: 80, height: 46, label: "CONTROL" },
            // Objeto de ruido 1: Caja fuerte / bóveda menor
            {
                propType: "safe",
                x: 70, y: 70, width: 50, height: 50,
                label: "CAJA CHICA",
                isNoise: true,
                clueType: "document",
                title: "Caja Fuerte: Arqueo de Caja Chica",
                clue: "Acta de arqueo periódico de caja menor: Fondos asignados por Bs. 1.000. Facturas y vales de caja adjuntos por compra de café en grano, bidones de agua mineral y suministros de limpieza por Bs. 720, con remanente en efectivo de Bs. 280 en billetes de curso legal."
            },
            // Mesa de juntas central
            {
                propType: "conferenceTable",
                x: 420, y: 315, width: 150, height: 64,
                label: "MESA DE JUNTA"
            },
            // Objeto de ruido 2: Pizarra de juntas
            {
                propType: "whiteboard",
                x: 460, y: 216, width: 70, height: 32,
                label: "METAS",
                isNoise: true,
                clueType: "document",
                title: "Pizarra de Juntas: Metas Comerciales",
                clue: "Esquema de planificación comercial: Gráfica comparativa de metas de captación de cuentas corporativas, proyección de comisiones bancarias para el segundo semestre y cronograma de reuniones con proveedores de servicios de auditoría."
            },
            // Archivador en despacho gerencial
            {
                propType: "filingCabinet",
                x: 990, y: 80, width: 44, height: 44,
                label: "LEGAJOS"
            },
            // Objeto de ruido 3: Memorando antiguo (Cajón inferior) con código sutil
            {
                propType: "filingCabinet",
                x: 880, y: 220, width: 44, height: 44,
                label: "CAJÓN",
                isNoise: true,
                clueType: "oldNote",
                title: "Memorando antiguo (Cajón inferior)",
                clue: "Para: Claudia — Gerencia. Te dejé las llaves del depósito en el segundo cajón. Me voy de permiso el viernes y no pienso contestar el teléfono. Si necesitas sacar las cajas por la puerta de seguridad, recuerda que don Ernesto nunca quiso cambiar la combinación desde que abrió la sucursal: dejó los últimos cuatro dígitos de su extensión interna de toda la vida (la 8415). Avísale a soporte antes de cerrar."
            }
        ]
    },

    // =========================================================================
    // SALA 4 — CENTRAL DE COMUNICACIONES
    // Sala en forma de "U" rodeando una isla central de operadores/enrutamiento,
    // con cabinas laterales de telecomunicaciones y pasillos perimetrales libres.
    // =========================================================================
    4: {
        desks: [
            {
                x: 480, y: 260, width: 160, label: "CORREO",
                clueType: "computer",
                clue: "Captura de paquetes en enrutador de borde: El sniffer de red reveló una regla de desvío clandestina instalada en el conmutador troncal. La regla interceptaba y duplicaba en tiempo real los mensajes de datos, flujos de correo electrónico y paquetes de comunicación en tránsito emitidos por entidades corporativas competidoras."
            },
            {
                x: 200, y: 70, width: 160, label: "GERENCIA",
                clueType: "document",
                clue: "Acta notariada del comité de administración corporativa: La decisión de interceptar y capturar el flujo telemático de las empresas competidoras fue acordada formalmente en reunión de junta directiva. Las operaciones se ejecutaron utilizando los servidores, enlaces de fibra y recursos financieros propios de la persona jurídica, actuando en su exclusivo interés comercial."
            },
            {
                x: 480, y: 400, width: 160, label: "REDES",
                clueType: "computer",
                clue: "Rastreo financiero de la división de investigaciones telemáticas: Los paquetes de mensajes de datos y comunicaciones interceptadas fueron recopilados, empaquetados y cedidos a terceras firmas de consultoría mediante contratos privados, habiéndose comprobado cobros en divisas orientados a la obtención de un provecho económico ilícito."
            },
            {
                x: 200, y: 560, width: 160, label: "LEGAL",
                clueType: "document",
                clue: "Informe de la fiscalía especializada: Las actuaciones vinculan directamente a los miembros del órgano de administración de la compañía en la toma de decisiones. El expediente establece que la conducta se ejecutó valiéndose de la estructura societaria mercantil para lucrarse comercialmente con la transmisión y cesión de comunicaciones privadas ajenas."
            }
        ],
        racks: [
            { x: 690, y: 260, label: "ROUTER 01" },
            { x: 690, y: 400, label: "SWITCH 02" },
            { x: 960, y: 90, label: "ENLACE 01" },
            { x: 960, y: 510, label: "ENLACE 02" }
        ],
        plants: [
            { x: 50, y: 200 },
            { x: 960, y: 340 }
        ],
        walls: [
            // Mamparas que delimitan la isla central en U (abierta al este con 290px de luz)
            { x: 430, y: 210, width: 14, height: 320 },
            { x: 430, y: 210, width: 330, height: 14 },
            { x: 430, y: 516, width: 330, height: 14 }
        ],
        decor: [
            // Objeto de ruido 1: Impresora en cabina norte
            {
                propType: "printer",
                x: 480, y: 70, width: 50, height: 44,
                label: "CONMUTADOR",
                isNoise: true,
                clueType: "document",
                title: "Impresora de Conmutador: Bitácora PBX",
                clue: "Registro automático de la centralita telefónica PBX: 130 llamadas entrantes procesadas en recepción comercial durante el turno matutino, con 42 derivaciones al departamento de atención al cliente y 18 registros en el conmutador de buzón de voz."
            },
            // Objeto de ruido 2: Archivador en cabina sur
            {
                propType: "filingCabinet",
                x: 480, y: 580, width: 44, height: 44,
                label: "ENLACES",
                isNoise: true,
                clueType: "document",
                title: "Archivador: Contratos de Troncales",
                clue: "Legajo de telecomunicaciones y contratos de servicio: Acuerdos corporativos de provisión de enlace troncal de fibra óptica simétrica (1 Gbps), anexos técnicos de nivel de servicio (SLA 99.8%) y comprobantes de facturación mensual del operador de Internet."
            }
        ]
    },

    // =========================================================================
    // SALA 5 — LABORATORIO DE SOFTWARE
    // Distribución asimétrica con islas de estaciones de prueba, pizarra de
    // arquitectura y zona acordonada de CUARENTENA / EQUIPO INCAUTADO.
    // =========================================================================
    5: {
        doorCode: "5903",
        desks: [
            {
                x: 440, y: 90, width: 160, label: "REPOSITORIO",
                clueType: "computer",
                clue: "Registro de control de versiones Git: A través de una sesión remota no autorizada, se descargó el árbol completo del repositorio que contiene el código fuente y módulos compilados del software propietario desarrollado por la empresa para su comercialización exclusiva."
            },
            {
                x: 440, y: 540, width: 160, label: "PROPIEDAD",
                clueType: "document",
                clue: "Evidencia electrónica de comercialización digital: Se recolectaron correos electrónicos y facturas proforma que demuestran que el código fuente sustraído fue reproducido, renombrado y comercializado ilícitamente a clientes externos bajo cobro de licencias de suscripción para beneficio monetario del infractor, sin que mediara engaño publicitario sobre el producto."
            },
            {
                x: 140, y: 540, width: 160, label: "DICTAMEN",
                clueType: "document",
                clue: "Ficha técnica de recursos humanos y auditoría pericial: El imputado se desempeñaba como líder técnico del proyecto de ingeniería, cargo que le otorgaba custodia y acceso privilegiado a las claves maestras del repositorio. El informe pericial constata un severo perjuicio patrimonial sobre los activos de propiedad industrial de la compañía, exigiendo la fijación de la indemnización compensatoria con auxilio de expertos."
            }
        ],
        racks: [
            { x: 960, y: 490, label: "TEST SERVER" }
        ],
        plants: [
            { x: 50, y: 250 },
            { x: 50, y: 440 },
            { x: 700, y: 620 }
        ],
        walls: [
            // Muros asimétricos del laboratorio con amplia abertura central de 208px
            { x: 360, y: 22, width: 14, height: 230 },
            { x: 360, y: 460, width: 14, height: 258 },
            { x: 720, y: 22, width: 14, height: 160 }
        ],
        decor: [
            // Objeto de ruido 1: Pizarra de arquitectura UI/UX
            {
                propType: "whiteboard",
                x: 140, y: 60, width: 80, height: 40,
                label: "ARQUITECTURA",
                isNoise: true,
                clueType: "document",
                title: "Pizarra de Arquitectura: Mockups UI/UX",
                clue: "Diagrama de experiencia de usuario (UI/UX): Mapa de navegación de pantallas, wireframes preliminares para la versión móvil del portal web y lista de requerimientos de diseño estético para botones, tipografías y paletas de colores corporativas."
            },
            // Zona de Cuarentena: Caja de evidencia preservada
            {
                propType: "evidenceBox",
                x: 800, y: 90, width: 44, height: 38,
                label: "EVIDENCIA 01"
            },
            // Objeto de ruido 2: Caja de archivo con componentes en depósito
            {
                propType: "evidenceBox",
                x: 920, y: 90, width: 44, height: 38,
                label: "PERIFÉRICOS",
                isNoise: true,
                clueType: "document",
                title: "Caja de Archivo: Lote de Periféricos",
                clue: "Inventario de componentes periféricos en depósito: Lote de 14 teclados USB estándar con cables deteriorados, 9 ratones ópticos genéricos en desuso y 20 cables de alimentación eléctrica retirados de las estaciones de trabajo para recambio tecnológico."
            },
            // Objeto de ruido 3: Hoja de cuaderno olvidada con código sutil
            {
                propType: "table",
                x: 800, y: 220, width: 50, height: 44,
                label: "CUADERNO",
                isNoise: true,
                clueType: "oldNote",
                title: "Hoja de cuaderno olvidada",
                clue: "Bitácora personal — Ing. R. Blanco. Otra madrugada compilando parches sin café. El jefe de seguridad se molestó porque dejé la zona de cuarentena abierta, así que activé el teclado numérico de la salida. Para no olvidarlo mientras terminamos la migración, usé el número de lote del primer equipo que catalogamos este trimestre, el Lote #5903. El lunes lo cambio por uno aleatorio."
            }
        ]
    }
};
