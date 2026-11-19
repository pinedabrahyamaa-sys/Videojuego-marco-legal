window.Game = window.Game || {};

// Desafíos periciales en dos fases conforme a la Ley Especial contra los Delitos Informáticos (Gaceta N.° 37.313)
window.Game.PUZZLES = {
    1: {
        title: "Expediente 01 // Intrusión y Abuso de Credenciales",
        summary: "Un operador de soporte excedió su autorización asignada e ingresó a áreas reservadas valiéndose de una contraseña retenida de un superior.",
        step1: {
            prompt: "PASO 1/2 — Tipifica el delito principal y su pena base según el Capítulo I:",
            options: [
                {
                    text: "Acceso indebido (Art. 6): 1 a 5 años de prisión y multa de 10 a 50 UT.",
                    correct: true,
                    feedback: "Correcto: Quien sin autorización o excediendo la obtenida use o intercepte un sistema incurre en el Art. 6."
                },
                {
                    text: "Sabotaje a sistemas (Art. 7): 4 a 8 años de prisión y multa de 400 a 800 UT.",
                    correct: false,
                    feedback: "No aplica: No se acreditó daño, alteración, inutilización ni destrucción de componentes o programas."
                },
                {
                    text: "Apropiación de propiedad intelectual (Art. 25): 1 a 5 años y multa de 100 a 500 UT.",
                    correct: false,
                    feedback: "No aplica: El peritaje demostró acceso al panel, sin copia, reproducción ni comercialización de software."
                }
            ]
        },
        step2: {
            prompt: "PASO 2/2 — Determina el agravante específico y las penas accesorias aplicables:",
            options: [
                {
                    text: "Aumento de 1/3 a 1/2 por contraseña ajena y abuso de cargo (Art. 27), más trabajo comunitario o inhabilitación profesional hasta 3 años (Art. 29).",
                    correct: true,
                    feedback: "Correcto: Retener contraseñas y abusar de funciones de acceso agrava la pena según los Arts. 27 y 29."
                },
                {
                    text: "Atenuación facultativa por falta de dolo (Art. 8): reducción de la pena a un tercio.",
                    correct: false,
                    feedback: "No aplica: El Art. 8 regula el favorecimiento culposo, no atenúa el dolo en acceso indebido no autorizado."
                },
                {
                    text: "Indemnización civil automática y obligatoria del Capítulo V (Art. 31).",
                    correct: false,
                    feedback: "No aplica: El Art. 31 circunscribe la indemnización preceptiva a delitos de los Capítulos II y V, no al Capítulo I."
                }
            ]
        },
        verdict: "DICTAMEN VALIDADO: Se califica como Acceso Indebido (Art. 6) con agravantes del Art. 27 por retención de contraseña ajena y prevalimiento de cargo, aplicándose accesorias del Art. 29.",
        report: {
            room: "Sala 1: Soporte",
            crime: "Acceso Indebido Calificado",
            articles: "Arts. 6, 27 y 29",
            penalty: "Prisión de 1 a 5 años (+ 1/3 a 1/2) | Multa 10–50 UT | Inhabilitación profesional o trabajo comunitario hasta 3 años"
        }
    },
    2: {
        title: "Expediente 02 // Sabotaje a Servidores de Datos Protegidos",
        summary: "Se detectó la inserción dolosa de un virus informático que colapsó los servidores centrales con datos personales y comerciales.",
        step1: {
            prompt: "PASO 1/2 — Tipifica el delito principal y su pena base según el Capítulo I:",
            options: [
                {
                    text: "Sabotaje mediante virus (Art. 7): 5 a 10 años de prisión y multa de 500 a 1.000 UT.",
                    correct: true,
                    feedback: "Correcto: La introducción intencional de un virus que destruye o inutiliza sistemas eleva la pena según el segundo aparte del Art. 7."
                },
                {
                    text: "Sabotaje simple sin virus (Art. 7): 4 a 8 años de prisión y multa de 400 a 800 UT.",
                    correct: false,
                    feedback: "No aplica: La prueba técnica comprobó el uso de un virus informático (Art. 2 lit. h), tipificación agravada del Art. 7."
                },
                {
                    text: "Espionaje informático (Art. 11): 3 a 6 años de prisión y multa de 300 a 600 UT.",
                    correct: false,
                    feedback: "No aplica: El informe forense constató destrucción operativa, no sustracción o revelación de secretos de Estado."
                }
            ]
        },
        step2: {
            prompt: "PASO 2/2 — Determina el agravante aplicable a la infraestructura vulnerada:",
            options: [
                {
                    text: "Aumento de 1/3 a 1/2 por afectar un sistema protegido con datos personales y patrimoniales (Art. 9).",
                    correct: true,
                    feedback: "Correcto: El Art. 9 agrava de un tercio a la mitad los delitos del Capítulo I que vulneren sistemas protegidos con datos personales."
                },
                {
                    text: "Reducción de pena de 1/2 a 2/3 por favorecimiento culposo de la administración (Art. 8).",
                    correct: false,
                    feedback: "No aplica: El dictamen pericial constató dolo directo del atacante, descartando impericia o negligencia."
                },
                {
                    text: "Sanción exclusiva de multa doble a persona jurídica sin pena corporal (Art. 28).",
                    correct: false,
                    feedback: "No aplica: El autor material responde penalmente con la privativa de libertad agravada por el Art. 9."
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
        title: "Expediente 03 // Desvío de Fondos por Instrucciones Falsas",
        summary: "Se constató la alteración fraudulenta del código contable para desviar fondos patrimoniales hacia cuentas no autorizadas.",
        step1: {
            prompt: "PASO 1/2 — Tipifica el delito patrimonial y su sanción base según el Capítulo II:",
            options: [
                {
                    text: "Fraude informático (Art. 14): 3 a 7 años de prisión y multa de 300 a 700 UT.",
                    correct: true,
                    feedback: "Correcto: Modificar datos o insertar instrucciones falsas para provecho propio en perjuicio ajeno es fraude (Art. 14)."
                },
                {
                    text: "Manejo fraudulento de tarjetas inteligentes (Art. 16): 5 a 10 años y multa de 500 a 1.000 UT.",
                    correct: false,
                    feedback: "No aplica: No hubo clonación, retención ilícita ni alteración física o lógica de tarjetas inteligentes (Art. 2 lit. i)."
                },
                {
                    text: "Hurto informático simple (Art. 13): 2 a 6 años de prisión y multa de 200 a 600 UT.",
                    correct: false,
                    feedback: "No aplica: En el hurto hay simple apoderamiento; la inserción de instrucciones falsas en el sistema constituye fraude."
                }
            ]
        },
        step2: {
            prompt: "PASO 2/2 — Determina la consecuencia de responsabilidad civil obligatoria:",
            options: [
                {
                    text: "Indemnización civil equivalente al daño causado determinada con auxilio de expertos (Art. 31, aplicable al Capítulo II).",
                    correct: true,
                    feedback: "Correcto: El Art. 31 ordena al juez imponer indemnización civil obligatoria en las condenas del Capítulo II."
                },
                {
                    text: "Comiso de equipos como única sanción patrimonial procedente (Art. 19).",
                    correct: false,
                    feedback: "No aplica: El comiso de equipos del Art. 19 es accesorio y no extingue la obligación de indemnizar los perjuicios causados."
                },
                {
                    text: "Pena accesoria exclusiva de trabajo comunitario del Art. 6.",
                    correct: false,
                    feedback: "No aplica: El trabajo comunitario del Art. 6 es específico del acceso indebido; el fraude del Cap. II exige indemnización patrimonial."
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
        title: "Expediente 04 // Interceptación y Cesión Corporativa Ilícita",
        summary: "La directiva de una empresa acordó interceptar y comercializar mensajes de datos de competidores usando recursos de la corporación.",
        step1: {
            prompt: "PASO 1/2 — Tipifica el delito contra las comunicaciones ajenas según el Capítulo III:",
            options: [
                {
                    text: "Violación de la privacidad de las comunicaciones (Art. 21) y revelación indebida (Art. 22): 2 a 6 años y 200 a 600 UT.",
                    correct: true,
                    feedback: "Correcto: Interceptar mensajes de datos ajenos (Art. 21) y divulgar su contenido sin consentimiento (Art. 22) configura este tipo."
                },
                {
                    text: "Oferta engañosa telemática (Art. 26): 1 a 5 años de prisión y multa de 100 a 500 UT.",
                    correct: false,
                    feedback: "No aplica: No se investiga publicidad engañosa al consumidor, sino interceptación ilegal de comunicaciones privadas."
                },
                {
                    text: "Acceso indebido simple a sistemas (Art. 6): 1 a 5 años y multa de 10 a 50 UT.",
                    correct: false,
                    feedback: "No aplica: El acceso simple queda subsumido en el tipo penal especial de interceptación de mensajes de datos (Art. 21)."
                }
            ]
        },
        step2: {
            prompt: "PASO 2/2 — Determina la agravante por fin de lucro y la sanción corporativa aplicable:",
            options: [
                {
                    text: "Aumento de 1/3 a 1/2 por fin de lucro (Art. 22), multa por el doble del monto a la persona jurídica (Arts. 5 y 28) y suspensión de cargos directivos hasta 3 años (Art. 29).",
                    correct: true,
                    feedback: "Correcto: El fin de lucro agrava el Art. 22; el Art. 28 impone multa doble a la PJ y el Art. 29 sanciona a los directivos."
                },
                {
                    text: "Exención de responsabilidad penal para la persona jurídica y directivos.",
                    correct: false,
                    feedback: "No aplica: El Art. 5 consagra expresamente la responsabilidad penal de personas jurídicas por decisiones de sus órganos."
                },
                {
                    text: "Solo indemnización civil patrimonial sin sanción penal corporal ni corporativa.",
                    correct: false,
                    feedback: "No aplica: La Ley contempla penas de prisión para los autores materiales y multa doble para el ente corporativo (Art. 28)."
                }
            ]
        },
        verdict: "DICTAMEN VALIDADO: Violación a la privacidad de comunicaciones y cesión con fin de lucro (Arts. 21 y 22), con responsabilidad penal corporativa (Arts. 5 y 28) e inhabilitación directiva (Art. 29).",
        report: {
            room: "Sala 4: Comunicaciones",
            crime: "Interceptación y Revelación Lucrativa Corporativa",
            articles: "Arts. 5, 21, 22, 28 y 29",
            penalty: "Prisión de 2 a 6 años (+ 1/3 a 1/2) | Multa PJ doble del delito | Suspensión directiva hasta 3 años"
        }
    },
    5: {
        title: "Expediente 05 // Apropiación y Venta de Código Propietario",
        summary: "Un desarrollador de confianza sustrajo el repositorio de software propietario de la organización para distribuirlo comercialmente.",
        step1: {
            prompt: "PASO 1/2 — Tipifica el delito contra el orden económico y la propiedad intelectual según el Capítulo V:",
            options: [
                {
                    text: "Apropiación de propiedad intelectual (Art. 25): 1 a 5 años de prisión y multa de 100 a 500 UT.",
                    correct: true,
                    feedback: "Correcto: Reproducir, copiar, modificar o divulgar sin autorización un software obtenido de un sistema con fin económico viola el Art. 25."
                },
                {
                    text: "Falsificación de documentos informáticos (Art. 12): 3 a 6 años y multa de 300 a 600 UT.",
                    correct: false,
                    feedback: "No aplica: No se forjó ningún documento probatorio; se sustrajo y comercializó código fuente de software."
                },
                {
                    text: "Fraude informático por manipulación (Art. 14): 3 a 7 años y multa de 300 a 700 UT.",
                    correct: false,
                    feedback: "No aplica: El software es una obra intelectual; su copia y distribución ilícita se tipifica en el tipo especial del Art. 25."
                }
            ]
        },
        step2: {
            prompt: "PASO 2/2 — Determina la concurrencia de agravantes y consecuencias acumuladas:",
            options: [
                {
                    text: "Aumento de 1/3 a 1/2 por abuso de posición privilegiada e inhabilitación hasta 3 años (Arts. 27 y 29), más indemnización civil con auxilio de expertos (Art. 31, Capítulo V).",
                    correct: true,
                    feedback: "Correcto: Concurren el abuso de cargo (Art. 27), inhabilitación profesional (Art. 29) e indemnización obligatoria del Capítulo V (Art. 31)."
                },
                {
                    text: "Reducción de pena por favorecimiento culposo o negligencia inexcusable (Art. 8).",
                    correct: false,
                    feedback: "No aplica: Existió lucro comercial premeditado, incompatible con la figura culposa del Art. 8."
                },
                {
                    text: "Comiso exclusivo de tarjetas plásticas inteligentes (Art. 19) sin reparación pecuniaria.",
                    correct: false,
                    feedback: "No aplica: El Art. 19 rige sobre medios de pago; el Art. 31 ordena la reparación civil exhaustiva en delitos del Capítulo V."
                }
            ]
        },
        verdict: "DICTAMEN VALIDADO: Apropiación indebida de propiedad intelectual de software (Art. 25) con agravante de prevalimiento de cargo (Art. 27), inhabilitación profesional (Art. 29) e indemnización del daño (Art. 31).",
        report: {
            room: "Sala 5: Software",
            crime: "Apropiación Ilícita de Propiedad Intelectual",
            articles: "Arts. 25, 27, 29 y 31",
            penalty: "Prisión de 1 a 5 años (+ 1/3 a 1/2) | Multa 100–500 UT | Inhabilitación profesional e indemnización civil"
        }
    }
};
