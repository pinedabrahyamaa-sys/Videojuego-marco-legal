window.Game = window.Game || {};

window.Game.ROOM_NAMES = {
    1: "Oficina de Soporte",
    2: "Núcleo de Servidores",
    3: "Área Financiera",
    4: "Central de Comunicaciones",
    5: "Laboratorio de Software"
};

window.Game.ROOM_LAYOUTS = {
    // sala 1
    1: {
        npcs: [
            {
                id: "carlos_mendez",
                name: "Carlos Méndez",
                role: "Analista de Soporte",
                x: 450,
                y: 340,
                gender: "male",
                outfitColor: "#cbd5e1",
                hairColor: "#2b2d42",
                intro: "Buenas, detective. Yo estaba cubriendo la guardia de la mañana cuando el monitor empezó a registrar accesos no autorizados.",
                questions: [
                    {
                        q: "¿Quién tenía credenciales para entrar a ese puesto?",
                        a: "En teoría solo los analistas activos. Pero un muchacho que renunció el mes pasado nunca entregó su tarjeta ni le dieron de baja a su cuenta de respaldo en el sistema."
                    },
                    {
                        q: "¿Notó si se llevaron o alteraron algún documento?",
                        a: "En papel no falta nada, revisamos las carpetas. El problema es que alguien se metió desde esa máquina a consultar módulos internos sin tener autorización."
                    },
                    {
                        q: "¿Algo más fuera de lo común en la oficina?",
                        a: "Nada raro... lo de siempre: la impresora que se traba con papel reciclado y las consultas rutinarias de los usuarios."
                    }
                ]
            }
        ],
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
            { x: 350, y: 22, width: 14, height: 170 },
            { x: 350, y: 192, width: 130, height: 14 },
            { x: 330, y: 490, width: 14, height: 228 },
            { x: 330, y: 476, width: 140, height: 14 },
            { x: 780, y: 22, width: 14, height: 220 },
            { x: 780, y: 242, width: 100, height: 14 },
            { x: 970, y: 242, width: 130, height: 14 }
        ],
        decor: [
            { type: "table", propType: "table", x: 180, y: 320, width: 90, height: 48, label: "RECEPCIÓN" },
            {
                propType: "printer",
                x: 600, y: 320, width: 50, height: 44,
                label: "IMPRESORA 01",
                isNoise: true,
                clueType: "document",
                title: "Aviso de soporte técnico",
                clue: "Aviso de soporte: Bandeja 2 trabada con papel reciclado. Se imprimió el rol de guardias técnicas del fin de semana (Turno sábado: Méndez; domingo: Rivas). Favor no recargar hojas arrugadas en el alimentador de la impresora."
            },
            {
                propType: "filingCabinet",
                x: 820, y: 70, width: 46, height: 44,
                label: "FACTURAS",
                isNoise: true,
                clueType: "document",
                title: "Relación de compras de papelería",
                clue: "Relación de compras de oficina: Factura por 10 resmas de papel bond carta, 3 cajas de bolígrafos Kilométrico, grapas estándar y 2 tóners de repuesto cancelados a Distribuidora Los Próceres por Bs. 850.000. Falta firma de recibido de administración."
            },
            {
                propType: "evidenceBox",
                x: 990, y: 70, width: 44, height: 38,
                label: "SUMINISTROS"
            }
        ]
    },

    // sala 2
    2: {
        doorCode: "2048",
        npcs: [
            {
                id: "luis_herrera",
                name: "Luis Herrera",
                role: "Técnico de Infraestructura",
                x: 200,
                y: 340,
                gender: "male",
                outfitColor: "#334155",
                hairColor: "#1e293b",
                intro: "Saludos, inspector. Para mí que en administración se alarmaron de más; esto tuvo pinta de un simple bajón de luz o un comando mal metido.",
                questions: [
                    {
                        q: "¿Usted asegura que la caída del servidor fue accidental?",
                        a: "Mire, a cualquiera se le va un comando haciendo mantenimiento... pero siendo sincero, ese script raro que corrió en el servidor principal nadie de mi equipo lo reconoce."
                    },
                    {
                        q: "¿Alguien ajeno entró a la jaula fría?",
                        a: "Ahí solo entramos con llave los técnicos autorizados. Si revisa los registros de la consola sabrá si el sistema falló solo o si alguien le cargó instrucciones para tumbarlo."
                    },
                    {
                        q: "¿Conoce la clave actual del panel de salida?",
                        a: "Yo no me sé esa combinación. Morales la cambió antes de irse de vacaciones y él siempre dejaba papeles doblados por el archivo técnico."
                    }
                ]
            }
        ],
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
                clue: "Inventario de activos tecnológicos de la corporación: El clúster de servidores afectado cuenta con cortafuegos perimetrales redundantes, cifrado de volumen activo y contraseñas de acceso restringido. Las particiones dañadas alojan bases de datos con historiales clínicos, registros de identidad y estados patrimoniales de personas naturales y jurídicas."
            },
            {
                x: 740, y: 310, width: 160, label: "ANÁLISIS",
                clueType: "computer",
                clue: "Acta de inspección de seguridad pericial: Los sistemas destruidos constituyen el núcleo de resguardo de datos personales y comerciales protegidos por estrictos protocolos de custodia de la organización. El peritaje confirmó que la vulneración recayó directamente sobre un entorno dotado de mecanismos activos de protección institucional."
            }
        ],
        racks: [
            { x: 460, y: 80, label: "SRV-A1" },
            { x: 600, y: 80, label: "SRV-A2" },
            { x: 740, y: 80, label: "SRV-A3" },
            { x: 880, y: 80, label: "SRV-A4" },
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
            { x: 370, y: 22, width: 14, height: 260 },
            { x: 370, y: 440, width: 14, height: 278 }
        ],
        decor: [
            {
                propType: "printer",
                x: 270, y: 80, width: 50, height: 44,
                label: "LOGGER",
                isNoise: true,
                clueType: "document",
                title: "Reporte de eventos del banco de baterías",
                clue: "Reporte de eventos del banco de baterías: A las 04:15 hrs hubo una fluctuación eléctrica en la zona que disparó el transfer automático del UPS principal durante 8 minutos. Todos los racks mantuvieron carga nominal sin corte de alimentación ni caída de tensión."
            },
            {
                propType: "acUnit",
                x: 1020, y: 180, width: 58, height: 50,
                label: "HVAC CLIMA",
                isNoise: true,
                clueType: "computer",
                title: "Bitácora de climatización ambiental",
                clue: "Bitácora de climatización: El compresor 2 del aire de precisión presentó goteo en la bandeja de condensado por la humedad de las lluvias del jueves. Se limpió el desagüe manual y la temperatura de la jaula se estabilizó en 19 °C."
            },
            {
                propType: "filingCabinet",
                x: 1020, y: 440, width: 44, height: 44,
                label: "ARCHIVO",
                isNoise: true,
                clueType: "oldNote",
                title: "Nota manuscrita en archivo técnico",
                clue: "Morales: si los de operaciones vienen a quejarse otra vez por el teclado de la jaula, diles que fue por el bajón de luz que descalibró el pestillo. Cambié la clave para que no entre cualquiera a curiosear: puse los megas de RAM del servidor de base de datos que montamos este año, 2048. Ni se te ocurra dejarla anotada en la pizarra."
            }
        ]
    },

    // sala 3
    3: {
        doorCode: "8415",
        npcs: [
            {
                id: "patricia_silva",
                name: "Patricia Silva",
                role: "Coordinadora Administrativa",
                x: 650,
                y: 430,
                gender: "female",
                outfitColor: "#5b2333",
                hairColor: "#3b1e28",
                intro: "Qué alivio que llegó la comisión del CICPC. Cuando cuadrábamos el cierre ayer por la tarde vimos un descuadre gravísimo en las transferencias.",
                questions: [
                    {
                        q: "¿Se perdieron tarjetas o sustrajeron dinero directamente?",
                        a: "No tocaron plásticos ni cajeros. Lo que hicieron fue modificar las instrucciones del sistema contable para canalizar los pagos hacia una cuenta ajena."
                    },
                    {
                        q: "¿Ya calcularon el daño económico exacto?",
                        a: "A simple vista es imposible determinar el monto total; el banco nos advirtió que se necesitará una experticia contable e informática para cuantificar el perjuicio real."
                    },
                    {
                        q: "¿Quién administraba la puerta de seguridad?",
                        a: "Esa cerradura la manejaba don Ernesto desde que inauguramos la sede. Seguro dejó algún memorando con el código guardado en los gaveteros."
                    }
                ]
            }
        ],
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
            { x: 280, y: 22, width: 14, height: 260 },
            { x: 280, y: 440, width: 14, height: 278 },
            { x: 20, y: 200, width: 170, height: 14 },
            { x: 340, y: 200, width: 330, height: 14 },
            { x: 340, y: 520, width: 330, height: 14 },
            { x: 720, y: 22, width: 14, height: 210 }
        ],
        decor: [
            { type: "table", propType: "table", x: 130, y: 220, width: 80, height: 46, label: "CONTROL" },
            {
                propType: "safe",
                x: 70, y: 70, width: 50, height: 50,
                label: "CAJA CHICA",
                isNoise: true,
                clueType: "document",
                title: "Vale de caja menor",
                clue: "Vale provisional de caja menor: Bs. 450.000 entregados para bidones de agua mineral, café en grano, azúcar y refrigerios de la reunión de cierre de mes. Facturas grapadas en la carpeta amarilla de Tesorería."
            },
            {
                propType: "conferenceTable",
                x: 420, y: 315, width: 150, height: 64,
                label: "MESA DE JUNTA"
            },
            {
                propType: "whiteboard",
                x: 460, y: 216, width: 70, height: 32,
                label: "METAS",
                isNoise: true,
                clueType: "document",
                title: "Circular interna de administración",
                clue: "Circular administrativa N.° 14: Se recuerda a todo el personal consignar a tiempo los comprobantes de retención de ISLR y el reporte de viáticos antes del día 28. No se procesarán anticipos fuera de fecha."
            },
            {
                propType: "filingCabinet",
                x: 990, y: 80, width: 44, height: 44,
                label: "LEGAJOS"
            },
            {
                propType: "filingCabinet",
                x: 880, y: 220, width: 44, height: 44,
                label: "CAJÓN",
                isNoise: true,
                clueType: "oldNote",
                title: "Memorando en gaveta inferior",
                clue: "Claudia: me voy de permiso médico desde el viernes y regreso el martes. Dejé las carpetas del balance en el estante de arriba. Si don Ernesto no está y te toca abrir la puerta de seguridad, acuérdate de que él nunca quiso cambiar la clave: siguen siendo los cuatro números de su extensión del conmutador, la 8415. Pasa el pestillo al salir."
            }
        ]
    },

    // sala 4
    4: {
        npcs: [
            {
                id: "javier_rojas",
                name: "Javier Rojas",
                role: "Ingeniero de Redes",
                x: 300,
                y: 340,
                gender: "male",
                outfitColor: "#2d4a3e",
                hairColor: "#1a2520",
                intro: "Buenas tardes, detective. Los enlaces de mensajería interna estuvieron desviando tráfico hacia afuera durante toda la madrugada.",
                questions: [
                    {
                        q: "¿Qué tipo de tráfico fue comprometido?",
                        a: "No buscaron las nóminas ni los saldos. Se dedicaron a capturar en tiempo real los correos y comunicaciones privadas que se cruzaban entre directores."
                    },
                    {
                        q: "¿Lograron rastrear desde dónde se ejecutó el ataque?",
                        a: "El paquete de ataque vino rebotado desde una dirección IP extranjera, pero la interceptación perjudicó de lleno las operaciones de nuestra oficina en Caracas."
                    },
                    {
                        q: "¿Existe ya alguna denuncia o juicio en el país de origen?",
                        a: "Hablamos con la consultoría jurídica: afuera no hay ningún procedimiento abierto ni esa gente ha sido procesada en ningún tribunal extranjero."
                    }
                ]
            }
        ],
        desks: [
            {
                x: 480, y: 260, width: 160, label: "CORREO",
                clueType: "computer",
                clue: "Captura de paquetes y trazas de enrutamiento internacional: El sniffer de red constató que la interceptación clandestina y desvío de los mensajes de datos y correos corporativos se ejecutó mediante un servidor alojado físicamente fuera del territorio nacional. No obstante, las transmisiones interceptadas correspondían a empresas domiciliadas en el país, sus efectos lesivos se consumaron íntegramente dentro del territorio de la República y no existe proceso judicial ni condena previa en tribunales extranjeros."
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
            { x: 430, y: 210, width: 14, height: 320 },
            { x: 430, y: 210, width: 330, height: 14 },
            { x: 430, y: 516, width: 330, height: 14 }
        ],
        decor: [
            {
                propType: "printer",
                x: 480, y: 70, width: 50, height: 44,
                label: "CONMUTADOR",
                isNoise: true,
                clueType: "document",
                title: "Aviso de mantenimiento de enlace",
                clue: "Aviso de proveedor de telecomunicaciones: Notificación de trabajos de mantenimiento nocturno en el cableado de la central telefónica de la zona el próximo miércoles de 01:00 a 05:00 hrs. Posible intermitencia temporal en enlaces dedicados y discado directo."
            },
            {
                propType: "filingCabinet",
                x: 480, y: 580, width: 44, height: 44,
                label: "ENLACES",
                isNoise: true,
                clueType: "document",
                title: "Minuta de guardia de redes",
                clue: "Minuta de guardia de redes: Se reportó caída del enlace secundario hacia la sede regional durante el aguacero del martes. Se verificó conmutación al canal de respaldo y se levantó el ticket de reclamo N.° 4108 ante la operadora."
            }
        ]
    },

    // sala 5
    5: {
        doorCode: "5903",
        npcs: [
            {
                id: "andres_delgado",
                name: "Andrés Delgado",
                role: "Desarrollador Junior",
                x: 620,
                y: 340,
                gender: "male",
                outfitColor: "#234b5c",
                hairColor: "#241f1c",
                intro: "Inspector, yo prefiero hablar con la verdad desde ya... Cuando la directiva propuso copiar ese código yo les dije que eso nos iba a traer líos legales.",
                questions: [
                    {
                        q: "¿Quién dio la orden de reproducir y vender el software?",
                        a: "Eso no fue invento de los programadores. Vino como instrucción por escrito de la gerencia de la contratista para comercializar el paquete a terceros."
                    },
                    {
                        q: "¿Qué equipos utilizaron para compilar y distribuir la copia?",
                        a: "Se usaron las estaciones de trabajo, los servidores y las licencias que paga la propia empresa, buscando lucrarse con el proyecto."
                    },
                    {
                        q: "¿Sabe por qué está bloqueado el teclado de la salida?",
                        a: "El ingeniero Blanco lo puso en la guardia de anoche antes de irse. Siempre anota esas claves en un cuaderno de notas que deja por los mesones."
                    }
                ]
            }
        ],
        desks: [
            {
                x: 440, y: 90, width: 160, label: "SOFTWARE",
                clueType: "computer",
                clue: "Registro de auditoría del servidor de desarrollo: A través de una sesión remota no autorizada, se descargó el paquete maestro que contiene el código fuente y programas de computación del software propietario desarrollado por la empresa para su comercialización exclusiva."
            },
            {
                x: 440, y: 540, width: 160, label: "PROPIEDAD",
                clueType: "document",
                clue: "Acta de asamblea y correspondencia corporativa interna: Se constató que la reproducción clandestina y comercialización ilícita del software propietario se ejecutó por decisión formal de la junta directiva y administradores de la empresa contratista, valiéndose de los servidores, canales de venta y recursos de la corporación para lucrarse en su interés exclusivo y preferente."
            },
            {
                x: 140, y: 540, width: 160, label: "DICTAMEN",
                clueType: "document",
                clue: "Ficha técnica de recursos humanos y auditoría pericial: El imputado principal actuó como líder técnico del proyecto, cargo que le otorgaba custodia y acceso privilegiado a los programas y sistemas de software de la organización. La comercialización del código protegido generó un perjuicio cuantificable al patrimonio del titular del software, acreditándose los extremos para la sanción corporativa a la persona jurídica, la inhabilitación del responsable y la indemnización civil obligatoria por expertos."
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
            { x: 360, y: 22, width: 14, height: 230 },
            { x: 360, y: 460, width: 14, height: 258 },
            { x: 720, y: 22, width: 14, height: 160 }
        ],
        decor: [
            {
                propType: "whiteboard",
                x: 140, y: 60, width: 80, height: 40,
                label: "ARQUITECTURA",
                isNoise: true,
                clueType: "document",
                title: "Pizarra de tareas pendientes",
                clue: "Esquema de módulos pendientes: Ajustar validación de cédulas en el formulario de clientes, corregir alineación de la grilla de consulta y revisar el reporte en hoja de cálculo antes del pase a producción."
            },
            {
                propType: "evidenceBox",
                x: 800, y: 90, width: 44, height: 38,
                label: "EVIDENCIA 01"
            },
            {
                propType: "evidenceBox",
                x: 920, y: 90, width: 44, height: 38,
                label: "PERIFÉRICOS",
                isNoise: true,
                clueType: "document",
                title: "Inventario de rezagos de hardware",
                clue: "Inventario de rezagos de hardware: 8 teclados PS/2 con teclas gastadas, 4 ratones de bola para limpieza de rodillos y rollos de cable UTP categoría 5 sobrantes de la instalación del piso 2."
            },
            {
                propType: "table",
                x: 800, y: 220, width: 50, height: 44,
                label: "CUADERNO",
                isNoise: true,
                clueType: "oldNote",
                title: "Hoja de cuaderno rayado",
                clue: "Nota de guardia — Ing. R. Blanco: Me quedé hasta la medianoche probando los instaladores. Para que el personal de limpieza no deje la puerta entreabierta de noche, bloqueé el acceso con el teclado. Puse de combinación el número de lote del servidor que llegó en el flete de la semana pasada, Lote #5903. El lunes a primera hora lo desbloqueo."
            }
        ]
    }
};
