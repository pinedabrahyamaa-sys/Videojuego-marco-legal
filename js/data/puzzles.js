window.Game = window.Game || {};

// preguntas del terminal para cada sala
window.Game.PUZZLES = {
    1: {
        title: "Expediente 01 - Intrusión y abuso de credenciales",
        summary: "Un operador de soporte escaló privilegios al panel de administración valiéndose de una credencial retenida de un exsupervisor, sin alterar datos ni insertar un virus o programa análogo.",
        step1: {
            prompt: "Paso 1 de 2: Conforme a la evidencia y el Manual legal [M], tipifica el delito principal:",
            options: [
                {
                    text: "Acceso indebido (Art. 6): Prisión de 1 a 5 años y multa de 10 a 50 UT.",
                    correct: true,
                    feedback: "Dictamen fiscal conforme: Se comprueba la penetración y uso no autorizado de un sistema mediante credencial no habilitada, sin destrucción de datos.",
                    fiscalFeedback: "Tipificación admitida por el Ministerio Público."
                },
                {
                    text: "Espionaje informático (Art. 11): Prisión de 3 a 6 años y multa de 300 a 600 UT.",
                    correct: false,
                    feedback: "Observación fiscal: No se constató obtención ni difusión de data clasificada que comprometa la seguridad del Estado.",
                    fiscalFeedback: "Fiscalía observa: El peritaje técnico no halló extracción de secretos de Estado ni vulneración de la seguridad de la República; la acción consistió en penetrar sin permiso en un entorno corporativo privado. Revise el Art. 6 frente al Art. 11 en el Manual Legal [M]."
                },
                {
                    text: "Violación de la privacidad de la data (Art. 20): Prisión de 2 a 6 años y multa de 200 a 600 UT.",
                    correct: false,
                    feedback: "Observación fiscal: No hubo apoderamiento ni cesión de archivos o registros de datos personales.",
                    fiscalFeedback: "Fiscalía observa: La evidencia digital descartó apoderamiento, cesión o modificación de registros personales en bases de datos; la conducta se limitó al uso e interacción no autorizada del sistema. Consulte el Art. 6 en el Manual [M]."
                },
                {
                    text: "Falsificación de documentos informáticos (Art. 12): Prisión de 3 a 6 años y multa de 300 a 600 UT.",
                    correct: false,
                    feedback: "Observación fiscal: Los registros de auditoría no presentan forja ni alteración de documentos con efectos probatorios.",
                    fiscalFeedback: "Fiscalía observa: La auditoría de integridad constató que no se crearon ni forjaron documentos o declaraciones con efectos jurídicos; no existe falsedad documental. Verifique el Art. 6 en el Manual Legal [M]."
                }
            ]
        },
        step2: {
            prompt: "PASO 2/2 — Determina la agravante específica y las sanciones accesorias acreditadas en las evidencias:",
            options: [
                {
                    text: "Aumento de 1/3 a 1/2 por uso de contraseña ajena retenida y abuso de funciones (Art. 27), con trabajo comunitario o inhabilitación profesional hasta 3 años (Art. 29).",
                    correct: true,
                    feedback: "Dictamen fiscal conforme: La retención de contraseña de exempleado y el abuso de la función técnica activan las agravantes del Art. 27 y accesorias del Art. 29.",
                    fiscalFeedback: "Circunstancia agravante y sanciones accesorias homologadas."
                },
                {
                    text: "Agravante de sistema protegido con datos sensibles (Art. 9) con pena privativa de 5 a 10 años.",
                    correct: false,
                    feedback: "Observación fiscal: El servidor de soporte no custodiaba historiales médicos ni registros de banca personal del Art. 9.",
                    fiscalFeedback: "Fiscalía observa: El sistema vulnerado no contenía data sensible de salud ni cuentas patrimoniales protegidas por el Art. 9; la circunstancia fáctica demostrada fue el uso de credencial ajena de un exempleado y abuso de cargo (Arts. 27 y 29)."
                },
                {
                    text: "Atenuación por favorecimiento culposo (Art. 8) con reducción de la pena entre la mitad y dos tercios.",
                    correct: false,
                    feedback: "Observación fiscal: La conducta fue intencional y deliberada, incompatible con la figura culposa del Art. 8.",
                    fiscalFeedback: "Fiscalía observa: El operador ejecutó una intrusión voluntaria valiéndose de una clave ajena; la ausencia de imprudencia o impericia descarta cualquier atenuación por culpa del Art. 8."
                },
                {
                    text: "Indemnización civil automática y obligatoria impuesta por expertos (Art. 31).",
                    correct: false,
                    feedback: "Observación fiscal: El Art. 31 circunscribe la indemnización preceptiva a los Capítulos II y V, no al acceso indebido del Capítulo I.",
                    fiscalFeedback: "Fiscalía observa: El Art. 31 limita la indemnización preceptiva en sentencia a los delitos contra la propiedad (Cap. II) y orden económico (Cap. V); el acceso indebido integra el Capítulo I y no produjo perjuicio económico cuantificable."
                }
            ]
        },
        verdict: "DICTAMEN VALIDADO: Se califica como Acceso Indebido (Art. 6) con agravantes del Art. 27 por retención de contraseña ajena y prevalimiento de funciones, aplicándose accesorias del Art. 29.",
        report: {
            room: "Sala 1: Soporte",
            crime: "Acceso Indebido Calificado",
            articles: "Arts. 6, 27 y 29",
            penalty: "Prisión de 1 a 5 años (+ 1/3 a 1/2) | Multa 10–50 UT | Inhabilitación profesional o trabajo comunitario hasta 3 años"
        }
    },

    2: {
        title: "Expediente 02 - Sabotaje a servidores de datos protegidos",
        summary: "Se detectó la inserción dolosa de un virus informático que colapsó irreversiblemente servidores protegidos que custodian datos patrimoniales y personales.",
        step1: {
            prompt: "Paso 1 de 2: Conforme al análisis de código y el Manual legal [M], tipifica el delito base:",
            options: [
                {
                    text: "Sabotaje o daño a sistemas mediante virus (Art. 7, segundo aparte): Prisión de 5 a 10 años y multa de 500 a 1.000 UT.",
                    correct: true,
                    feedback: "Dictamen fiscal conforme: La introducción voluntaria de un programa destructivo (virus) que inutiliza un sistema eleva la pena según el segundo aparte del Art. 7.",
                    fiscalFeedback: "Tipificación agravada por virus homologada."
                },
                {
                    text: "Favorecimiento culposo (Art. 8): Prisión reducida entre la mitad y dos tercios.",
                    correct: false,
                    feedback: "Observación fiscal: El código fue compilado con dolo directo, descartando impericia o descuido de los operadores.",
                    fiscalFeedback: "Fiscalía observa: El peritaje técnico comprobó la inserción deliberada de código malicioso con rutinas programadas de daño masivo; se descarta la negligencia o imprudencia requerida por el Art. 8. Consulte el Art. 7 en el Manual [M]."
                },
                {
                    text: "Acceso indebido a sistemas protegidos (Art. 9 en concordancia con Art. 6): Prisión de 1 a 5 años (+ 1/3 a 1/2).",
                    correct: false,
                    feedback: "Observación fiscal: La conducta no fue el mero ingreso no autorizado, sino la destrucción operativa total de la infraestructura.",
                    fiscalFeedback: "Fiscalía observa: El acto material no se limitó a acceder sin permiso; el objetivo consumado fue la destrucción e inutilización operativa de los clústeres mediante un programa destructivo (Art. 7). Revise el Manual Legal [M]."
                },
                {
                    text: "Posesión de equipos de sabotaje (Art. 10): Prisión de 3 a 6 años y multa de 300 a 600 UT.",
                    correct: false,
                    feedback: "Observación fiscal: El Art. 10 sanciona la tenencia o distribución previa de herramientas, no su ejecución material destructiva.",
                    fiscalFeedback: "Fiscalía observa: El tipo del Art. 10 castiga la mera tenencia o importación de programas de ataque; en este hecho el virus fue inoculado y ejecutado causando la pérdida irreversible de los sistemas (Art. 7)."
                }
            ]
        },
        step2: {
            prompt: "PASO 2/2 — Determina la agravante aplicable según la infraestructura y datos vulnerados:",
            options: [
                {
                    text: "Aumento de 1/3 a 1/2 de la pena por recaer sobre un sistema protegido que custodia información personal y patrimonial (Art. 9).",
                    correct: true,
                    feedback: "Dictamen fiscal conforme: El Art. 9 agrava las penas del Capítulo I cuando la agresión vulnera sistemas con medidas de seguridad activas y data personal/patrimonial.",
                    fiscalFeedback: "Agravante de protección calificada de sistemas admitida."
                },
                {
                    text: "Sanción exclusiva de multa doble para la persona jurídica operadora del data center (Art. 28).",
                    correct: false,
                    feedback: "Observación fiscal: La empresa propietaria es víctima del sabotaje, no autora ni beneficiaria del delito.",
                    fiscalFeedback: "Fiscalía observa: El ataque no fue cometido por decisión ni en interés de la persona jurídica víctima; el autor material responde con pena privativa de libertad agravada por la naturaleza protegida del sistema (Art. 9)."
                },
                {
                    text: "Pena accesoria única de comiso de la infraestructura de servidores dañada (Art. 29).",
                    correct: false,
                    feedback: "Observación fiscal: Los servidores colapsados constituyen el objeto material dañado, no un instrumento delictivo sujeto a comiso.",
                    fiscalFeedback: "Fiscalía observa: La infraestructura afectada es propiedad de la víctima; el comiso del Art. 29 solo recae sobre herramientas e implementos del agresor. La circunstancia aplicable es el aumento de pena del Art. 9."
                },
                {
                    text: "Atenuación obligatoria de pena por falta de medidas de protección perimetral (Art. 8).",
                    correct: false,
                    feedback: "Observación fiscal: El peritaje demostró la existencia de cortafuegos y cifrado activo vulnerados dolosamente.",
                    fiscalFeedback: "Fiscalía observa: El inventario acreditó la existencia de estrictas medidas de seguridad activas (firewalls y cifrado); la transgresión dolosa de estas protecciones agrava el tipo según el Art. 9, sin atenuantes de culpa."
                }
            ]
        },
        verdict: "DICTAMEN VALIDADO: Sabotaje informático calificado por virus (Art. 7, segundo aparte) con agravante especial por recaer sobre sistema protegido con data personal y patrimonial (Art. 9).",
        report: {
            room: "Sala 2: Servidores",
            crime: "Sabotaje con Virus en Sistema Protegido",
            articles: "Arts. 7, 8 y 9",
            penalty: "Prisión de 5 a 10 años (+ 1/3 a 1/2) | Multa 500–1.000 UT"
        }
    },

    3: {
        title: "Expediente 03 - Desvío de fondos por instrucciones falsas",
        summary: "Se constató la alteración fraudulenta del código contable para desviar fondos patrimoniales hacia cuentas no autorizadas mediante manipulación transaccional.",
        step1: {
            prompt: "Paso 1 de 2: Conforme a las trazas contables y el Manual legal [M], tipifica el delito patrimonial:",
            options: [
                {
                    text: "Fraude informático (Art. 14): Prisión de 3 a 7 años y multa de 300 a 700 UT.",
                    correct: true,
                    feedback: "Dictamen fiscal conforme: Modificar datos e insertar instrucciones falsas en un sistema con provecho injusto en perjuicio ajeno constituye fraude.",
                    fiscalFeedback: "Tipificación de fraude informático patrimonial homologada."
                },
                {
                    text: "Hurto electrónico (Art. 13): Prisión de 2 a 6 años y multa de 200 a 600 UT.",
                    correct: false,
                    feedback: "Observación fiscal: En el hurto existe apoderamiento sin adulteración de la lógica del sistema; aquí hubo inyección de instrucciones falsas.",
                    fiscalFeedback: "Fiscalía observa: En el hurto informático (Art. 13) el autor se apodera del activo sin engaño en el procesamiento; en este caso se insertaron instrucciones contables falsas en el algoritmo, configurándose el fraude del Art. 14. Revise el Manual [M]."
                },
                {
                    text: "Manejo fraudulento de tarjetas inteligentes (Art. 16): Prisión de 5 a 10 años y multa de 500 a 1.000 UT.",
                    correct: false,
                    feedback: "Observación fiscal: La pericia física descartó clonación o alteración de tarjetas plásticas inteligentes de pago.",
                    fiscalFeedback: "Fiscalía observa: El dictamen de laboratorio descartó manipulación o clonación de tarjetas plásticas inteligentes (definidas en Art. 2 lit. i); el ataque se ejecutó a nivel de comandos de software bancario. Consulte el Art. 14 en el Manual [M]."
                },
                {
                    text: "Obtención indebida de bienes o servicios (Art. 15): Prisión de 2 a 6 años y multa de 200 a 600 UT.",
                    correct: false,
                    feedback: "Observación fiscal: El tipo del Art. 15 sanciona el consumo ilícito de servicios (como servicios telefónicos o acceso telemático no autorizado), no el desvío ilícito de fondos líquidos.",
                    fiscalFeedback: "Fiscalía observa: El Art. 15 tipifica el acceso furtivo a servicios o consumos ajenos sin pago; la alteración de órdenes de dispersión para apropiarse de capital integra de manera exclusiva el fraude del Art. 14."
                }
            ]
        },
        step2: {
            prompt: "PASO 2/2 — Determina la consecuencia de responsabilidad civil obligatoria aplicable:",
            options: [
                {
                    text: "Indemnización civil equivalente al daño causado, fijada por el juez con auxilio de peritos (Art. 31, aplicable preceptivamente al Capítulo II).",
                    correct: true,
                    feedback: "Dictamen fiscal conforme: El Art. 31 ordena al juez imponer inexcusablemente indemnización civil de daños tasada por expertos en condenas del Capítulo II.",
                    fiscalFeedback: "Consecuencia civil indemnizatoria admitida."
                },
                {
                    text: "Inhabilitación profesional como única sanción sin orden de reparación del perjuicio económico (Art. 29).",
                    correct: false,
                    feedback: "Observación fiscal: La condena en delitos del Capítulo II exige obligatoriamente la indemnización civil del daño patrimonial según el Art. 31.",
                    fiscalFeedback: "Fiscalía observa: Aunque la inhabilitación procede como accesoria, el Art. 31 impone con carácter preceptivo la indemnización civil integral por integrar el Capítulo II (Delitos contra la Propiedad)."
                },
                {
                    text: "Comiso obligatorio de tarjetas inteligentes o instrumentos de pago (Art. 19).",
                    correct: false,
                    feedback: "Observación fiscal: No se emplearon tarjetas plásticas como instrumentos del delito en la manipulación contable.",
                    fiscalFeedback: "Fiscalía observa: El comiso del Art. 19 aplica sobre plásticos o bandas magnéticas delictivas; al haberse consumado el delito por manipulación algorítmica, la sanción patrimonial obligatoria es la indemnización del Art. 31."
                },
                {
                    text: "Atenuación de la responsabilidad civil por reintegro voluntario parcial sin experticia contable.",
                    correct: false,
                    feedback: "Observación fiscal: La determinación del daño indemnizable requiere auxilio de expertos forenses conforme al Art. 31.",
                    fiscalFeedback: "Fiscalía observa: La Ley Especial prohíbe fijaciones arbitrarias del daño; el Art. 31 impone que la cuantía del perjuicio sea determinada obligatoriamente con auxilio de peritos contables juramentados."
                }
            ]
        },
        verdict: "DICTAMEN VALIDADO: Se tipifica Fraude Informático (Art. 14) con imposición preceptiva de indemnización civil en auxilio de expertos por integrar el Capítulo II (Art. 31).",
        report: {
            room: "Sala 3: Financiera",
            crime: "Fraude Informático Patrimonial",
            articles: "Arts. 14 y 31",
            penalty: "Prisión de 3 a 7 años | Multa 300–700 UT | Indemnización civil de daños integral"
        }
    },

    4: {
        title: "Expediente 04 - Interceptación y cesión corporativa ilícita",
        summary: "La directiva de una empresa acordó interceptar y comercializar mensajes de datos de competidores usando recursos de la corporación para provecho societario.",
        step1: {
            prompt: "Paso 1 de 2: Conforme a la evidencia de captura en redes y el Manual legal [M], tipifica el delito matriz:",
            options: [
                {
                    text: "Violación de la privacidad de las comunicaciones (Art. 21): Prisión de 2 a 6 años y multa de 200 a 600 UT.",
                    correct: true,
                    feedback: "Dictamen fiscal conforme: La captura clandestina e interferencia de mensajes de datos en tránsito por redes de transmisión tipifica el Art. 21.",
                    fiscalFeedback: "Tipificación de interceptación de comunicaciones ajenas homologada."
                },
                {
                    text: "Violación de la privacidad de la data personal (Art. 20): Prisión de 2 a 6 años y multa de 200 a 600 UT.",
                    correct: false,
                    feedback: "Observación fiscal: El Art. 20 protege archivos o bases de datos estáticas; aquí se interceptó tráfico de red en transmisión.",
                    fiscalFeedback: "Fiscalía observa: El Art. 20 castiga el acceso o copia de datos en reposo dentro de bases de datos; el sniffer capturó mensajes de datos y correos en tránsito por canales de comunicación (Art. 21). Distinga ambos en el Manual [M]."
                },
                {
                    text: "Revelación indebida de data o información de carácter personal (Art. 22): Prisión de 2 a 6 años y multa de 200 a 600 UT.",
                    correct: false,
                    feedback: "Observación fiscal: La revelación es la fase posterior de difusión; el delito base y conducta matriz en el router fue la interceptación del Art. 21.",
                    fiscalFeedback: "Fiscalía observa: Si bien existió divulgación posterior, la acción delictiva originaria y autónoma ejecutada en el conmutador de red es la interceptación de mensajes de datos (Art. 21). Revise el Manual [M]."
                },
                {
                    text: "Espionaje informático (Art. 11): Prisión de 3 a 6 años y multa de 300 a 600 UT.",
                    correct: false,
                    feedback: "Observación fiscal: El tipo de espionaje exige agravio a la seguridad del Estado o intereses de la República, no comunicaciones mercantiles entre empresas.",
                    fiscalFeedback: "Fiscalía observa: La información interceptada correspondía a correos y contratos comerciales de competidores privados, no a secretos de Estado o defensa nacional del Art. 11. Consulte el Art. 21 en el Manual Legal [M]."
                }
            ]
        },
        step2: {
            prompt: "PASO 2/2 — Conforme al origen internacional de la conexión y las consecuencias comprobadas, determina la competencia jurisdiccional y agravantes aplicables:",
            options: [
                {
                    text: "Aplicación de la Ley penal venezolana por extraterritorialidad (Art. 3), al ejecutarse el delito desde el extranjero pero surtir efectos dentro de la República sin juzgamiento foráneo, con aumento de 1/3 a 1/2 por fin de lucro (Art. 22).",
                    correct: true,
                    feedback: "Dictamen fiscal conforme: Se configuran plenamente los supuestos del Art. 3 (extraterritorialidad) y la agravante por ánimo de lucro económico del Art. 22.",
                    fiscalFeedback: "Calificación de extraterritorialidad y agravante por lucro admitidas por el Ministerio Público."
                },
                {
                    text: "Incompetencia de los tribunales de la República por territorialidad estricta, debiendo remitirse la causa a los tribunales del país donde operaba el servidor proxy.",
                    correct: false,
                    feedback: "Observación fiscal: El Art. 3 consagra el principio de extraterritorialidad cuando los efectos se producen en Venezuela y no ha habido juicio previo afuera.",
                    fiscalFeedback: "Fiscalía observa: El Art. 3 de la Ley Especial consagra expresamente la extraterritorialidad de la ley penal cuando los efectos del delito se produzcan dentro del territorio nacional y el imputado no haya sido juzgado en el exterior. Revise el Art. 3 en el Manual [M]."
                },
                {
                    text: "Exoneración penal por falta de tratado bilateral de extradición y conmutación obligatoria por expulsión preventiva de extranjeros (Art. 30).",
                    correct: false,
                    feedback: "Observación fiscal: El juzgamiento no depende de tratados bilaterales previos si los efectos recaen en el país (Art. 3); la expulsión es accesoria posterior.",
                    fiscalFeedback: "Fiscalía observa: El juzgamiento no queda subordinado a tratados de extradición si el daño se produjo en el territorio de la República (Art. 3); además, la expulsión del Art. 30 opera solo después de cumplida la pena principal impuesta."
                },
                {
                    text: "Atenuación de la pena entre la mitad y dos tercios por favorecimiento culposo (Art. 8).",
                    correct: false,
                    feedback: "Observación fiscal: La Ley no atenúa por el uso de servidores extranjeros; la conducta dolosa con fin de lucro mantiene la plenitud punitiva.",
                    fiscalFeedback: "Fiscalía observa: La Ley Especial no contempla atenuantes de culpa (Art. 8) por operar desde el extranjero; al surtirse los efectos lesivos en territorio venezolano mediando ánimo de lucro, se aplica la agravación del Art. 22 bajo el imperio del Art. 3."
                }
            ]
        },
        verdict: "DICTAMEN VALIDADO: Violación a la privacidad de comunicaciones con aplicación de la Ley venezolana por extraterritorialidad (Art. 3) y agravante por fin de lucro (Art. 22).",
        report: {
            room: "Sala 4: Comunicaciones",
            crime: "Interceptación Extraterritorial y Lucro Ilícito",
            articles: "Arts. 3, 21 y 22",
            penalty: "Prisión de 2 a 6 años (+ 1/3 a 1/2 por lucro) | Multa 200–600 UT | Sujeción plena a la ley venezolana (Art. 3)"
        }
    },

    5: {
        title: "Expediente 05 - Apropiación y venta de código propietario",
        summary: "Un líder técnico sustrajo el código fuente y programas de software propietario de la organización para distribuirlo comercialmente bajo cobro de licencias ilícitas.",
        step1: {
            prompt: "Paso 1 de 2: Conforme a las pruebas de extracción de código y el Manual legal [M], tipifica el delito:",
            options: [
                {
                    text: "Apropiación de propiedad intelectual (Art. 25): Prisión de 1 a 5 años y multa de 100 a 500 UT.",
                    correct: true,
                    feedback: "Dictamen fiscal conforme: Reproducir, copiar, distribuir o divulgar sin autorización un software obtenido de un sistema con fin económico vulnera el Art. 25.",
                    fiscalFeedback: "Tipificación de apropiación de propiedad intelectual homologada."
                },
                {
                    text: "Oferta engañosa telemática (Art. 26): Prisión de 1 a 5 años y multa de 100 a 500 UT.",
                    correct: false,
                    feedback: "Observación fiscal: La oferta engañosa sanciona la publicidad falsa al consumidor sobre atributos inexistentes de un bien.",
                    fiscalFeedback: "Fiscalía observa: El investigado no realizó publicidad engañosa al consumidor sobre las características de un producto (Art. 26); sustrajo y comercializó un software propietario protegido. Consulte el Art. 25 en el Manual Legal [M]."
                },
                {
                    text: "Falsificación de documentos informáticos (Art. 12): Prisión de 3 a 6 años y multa de 300 a 600 UT.",
                    correct: false,
                    feedback: "Observación fiscal: El software sustraído estaba intacto y no fue forjado como documento probatorio falso.",
                    fiscalFeedback: "Fiscalía observa: El código fuente es una obra de ingenio protegida por propiedad intelectual; no se forjaron declaraciones probatorias ni firmas electrónicas falsas del Art. 12. Revise el Art. 25 en el Manual [M]."
                },
                {
                    text: "Espionaje informático (Art. 11): Prisión de 3 a 6 años y multa de 300 a 600 UT.",
                    correct: false,
                    feedback: "Observación fiscal: El programa informático objeto de copia ilícita no constituye data de seguridad nacional o secreto de Estado.",
                    fiscalFeedback: "Fiscalía observa: El código fuente sustraído es un activo de propiedad industrial mercantil de una empresa privada, no información clasificada que vulnere la soberanía o seguridad del Estado (Art. 11). Verifique el Art. 25 en el Manual [M]."
                }
            ]
        },
        step2: {
            prompt: "PASO 2/2 — Al comprobarse que la apropiación del software se ejecutó por acuerdo societario de la contratista, determina el régimen sancionatorio y consecuencias patrimoniales:",
            options: [
                {
                    text: "Responsabilidad penal societaria con sanción exclusiva de multa por el doble del monto del delito (Arts. 5 y 28), prevalimiento de cargo (Art. 27), inhabilitación profesional (Art. 29) e indemnización civil obligatoria fijada por peritos (Art. 31).",
                    correct: true,
                    feedback: "Dictamen fiscal conforme: El Art. 5 vincula a la persona jurídica por acuerdo directivo con sus medios, sancionándola con multa doble (Art. 28), inhabilitación del técnico (Art. 29) e indemnización imperativa del Capítulo V (Art. 31).",
                    fiscalFeedback: "Régimen sancionatorio especial corporativo y reparación civil homologados."
                },
                {
                    text: "Disolución corporativa obligatoria y comiso definitivo de la totalidad del patrimonio social de la empresa contratista a favor del Estado (Art. 29).",
                    correct: false,
                    feedback: "Observación fiscal: El Art. 28 circunscribe la sanción societaria a la multa pecuniaria por el doble del monto del delito cometido, no a la disolución mercantil.",
                    fiscalFeedback: "Fiscalía observa: El Art. 28 establece de forma taxativa que la sanción aplicable a las personas jurídicas es exclusivamente patrimonial de multa por el doble del monto del delito; la ley no autoriza la disolución o confiscación empresarial societaria."
                },
                {
                    text: "Exclusión de responsabilidad penal de la persona jurídica, imponiéndose penas corporales privativas de libertad exclusivamente a los directivos y programadores (Art. 5).",
                    correct: false,
                    feedback: "Observación fiscal: El Art. 5 consagra la responsabilidad penal societaria cuando el delito se comete por decisión de los administradores con recursos sociales o en su interés.",
                    fiscalFeedback: "Fiscalía observa: El Art. 5 impone expresamente la responsabilidad penal de las personas jurídicas cuando el hecho se ejecuta por decisión de sus órganos directivos y en beneficio corporativo, activando la multa del doble del Art. 28."
                },
                {
                    text: "Sanción corporativa conmutada a trabajo comunitario voluntario para los directores (Art. 29), extinguiendo la fijación judicial de indemnización civil de daños.",
                    correct: false,
                    feedback: "Observación fiscal: Las penas de trabajo comunitario no extinguen la multa societaria ni la indemnización civil inexcusable del Art. 31.",
                    fiscalFeedback: "Fiscalía observa: La imposición de accesorias individuales no sustituye la sanción pecuniaria del Art. 28 sobre la empresa; además, al integrar el Capítulo V (orden económico), el Art. 31 obliga al juez a tasar pericialmente la indemnización integral de los daños causados."
                }
            ]
        },
        verdict: "DICTAMEN VALIDADO: Apropiación de software (Art. 25) con responsabilidad corporativa y multa doble (Arts. 5 y 28), prevalimiento de funciones (Art. 27), inhabilitación (Art. 29) e indemnización civil integral (Art. 31).",
        report: {
            room: "Sala 5: Software",
            crime: "Apropiación Intelectual y Responsabilidad Corporativa",
            articles: "Arts. 5, 25, 27, 28, 29 y 31",
            penalty: "Prisión de 1 a 5 años (+ 1/3 a 1/2) | Multa PJ doble del delito (Art. 28) | Inhabilitación profesional e indemnización civil preceptiva"
        }
    }
};
