window.Game = window.Game || {};

// articulos de la ley para el manual
window.Game.GLOSSARY = {
    definitions: [
        {
            term: "Tecnología de información",
            art: "Art. 2, lit. a",
            def: "Rama de la tecnología dedicada al estudio, aplicación y procesamiento de datos (obtención, creación, almacenamiento, administración, modificación, manejo, movimiento, control, visualización, transmisión o recepción automática de información)."
        },
        {
            term: "Sistema",
            art: "Art. 2, lit. b",
            def: "Arreglo organizado de recursos y procedimientos diseñados para el uso de tecnologías de información, unidos y regulados por interacción o interdependencia para cumplir funciones específicas, o componentes combinados en un paquete funcional."
        },
        {
            term: "Data (datos)",
            art: "Art. 2, lit. c",
            def: "Hechos, conceptos, instrucciones o caracteres representados de manera apropiada para ser comunicados, transmitidos o procesados por seres humanos o medios automáticos, y a los cuales se les asigna o puede asignar un significado."
        },
        {
            term: "Información",
            art: "Art. 2, lit. d",
            def: "Significado que el ser humano le asigna a la data utilizando las convenciones conocidas y generalmente aceptadas."
        },
        {
            term: "Documento",
            art: "Art. 2, lit. e",
            def: "Registro incorporado en un sistema en forma de escrito, video, audio o cualquier otro medio, que contiene data o información acerca de un hecho o acto capaces de causar efectos jurídicos."
        },
        {
            term: "Computador",
            art: "Art. 2, lit. f",
            def: "Dispositivo o unidad funcional que acepta data, la procesa de acuerdo con un programa guardado y genera resultados, incluidas operaciones aritméticas o lógicas."
        },
        {
            term: "Hardware",
            art: "Art. 2, lit. g",
            def: "Equipos o dispositivos físicos considerados en forma independiente de su capacidad o función, que conforman un computador o sus componentes periféricos (herramientas, implementos, instrumentos, conexiones, ensamblajes y partes)."
        },
        {
            term: "Firmware",
            art: "Art. 2, lit. h",
            def: "Programa o segmento de programa incorporado de manera permanente en algún componente del hardware."
        },
        {
            term: "Software",
            art: "Art. 2, lit. i",
            def: "Información organizada en forma de programas de computación, procedimientos y documentación asociados, concebidos para realizar la operación de un sistema y proveer instrucciones y data a los computadores."
        },
        {
            term: "Programa",
            art: "Art. 2, lit. j",
            def: "Plan, rutina o secuencia de instrucciones utilizados para realizar un trabajo en particular o resolver un problema dado a través de un computador."
        },
        {
            term: "Procesamiento de datos",
            art: "Art. 2, lit. k",
            def: "Realización sistemática de operaciones sobre data o sobre información, tales como manejo, fusión, organización o cómputo."
        },
        {
            term: "Seguridad",
            art: "Art. 2, lit. l",
            def: "Condición que resulta del establecimiento y mantenimiento de medidas de protección que garanticen un estado de inviolabilidad frente a actos hostiles que propicien accesos no autorizados o afecten la operatividad del sistema."
        },
        {
            term: "Virus",
            art: "Art. 2, lit. m",
            def: "Programa o segmento de programa indeseado que se desarrolla incontroladamente y que genera efectos destructivos o perturbadores en un programa o componente del sistema."
        },
        {
            term: "Tarjeta inteligente",
            art: "Art. 2, lit. n",
            def: "Rótulo, cédula o carnet que se utiliza como instrumento de identificación, de acceso a un sistema, de pago o de crédito, que contiene data o información de uso restringido sobre el usuario autorizado para portarla."
        },
        {
            term: "Contraseña (password)",
            art: "Art. 2, lit. o",
            def: "Secuencia alfabética, numérica o combinación de ambas, protegida por reglas de confidencialidad, utilizada para verificar la autenticidad de la autorización expedida a un usuario para acceder a data o información en un sistema."
        },
        {
            term: "Mensaje de datos",
            art: "Art. 2, lit. p",
            def: "Cualquier pensamiento, idea, imagen, audio, data o información, expresados en un lenguaje conocido (explícito o secreto/encriptado), preparados en formato adecuado para ser transmitidos por un sistema de comunicaciones."
        }
    ],
    rules: [
        {
            term: "Extraterritorialidad",
            art: "Título I, Art. 3",
            def: "Cuando alguno de los delitos previstos en la Ley se cometa fuera del territorio de la República, el sujeto activo quedará sometido a sus disposiciones si dentro del territorio se hubieren producido efectos del hecho punible y el responsable no ha sido juzgado por el mismo hecho o ha evadido el juzgamiento o la condena por tribunales extranjeros."
        },
        {
            term: "Responsabilidad de personas jurídicas",
            art: "Título I, Art. 5",
            def: "Responden penalmente cuando el delito se cometa por decisión de sus órganos directivos o administradores, en el ámbito de su actividad, con recursos sociales o en su interés exclusivo o preferente."
        },
        {
            term: "Acceso indebido",
            art: "Capítulo I, Art. 6",
            def: "Prisión de 1 a 5 años y multa de 10 a 50 UT. Aplica a quien sin la debida autorización o excediendo la que hubiere obtenido, acceda, intercepte, interfiera o use un sistema que utilice tecnologías de información."
        },
        {
            term: "Sabotaje o daño a sistemas",
            art: "Capítulo I, Art. 7",
            def: "Prisión de 4 a 8 años y multa de 400 a 800 UT por destruir, dañar, modificar o inutilizar un sistema. Aparte segundo: si para ello se introduce un virus o programa destructivo, la pena se eleva de 5 a 10 años de prisión y multa de 500 a 1.000 UT."
        },
        {
            term: "Favorecimiento culposo de sabotaje",
            art: "Capítulo I, Art. 8",
            def: "Reducción de la pena entre la mitad y dos tercios. Aplica si el sabotaje o daño del Art. 7 se cometiere por imprudencia, negligencia, impericia o inobservancia de las normas establecidas (ausencia de dolo directo)."
        },
        {
            term: "Sistemas protegidos (Agravante)",
            art: "Capítulo I, Art. 9",
            def: "Las penas de los Arts. 6 y 7 aumentan entre 1/3 y 1/2 cuando el delito recaiga sobre sistemas protegidos por medidas de seguridad, que presten servicios públicos o que alojen información personal o patrimonial de personas naturales o jurídicas."
        },
        {
            term: "Posesión de equipos de sabotaje",
            art: "Capítulo I, Art. 10",
            def: "Prisión de 3 a 6 años y multa de 300 a 600 UT para quien fabrique, importe, distribuya o posea software, hardware o dispositivos diseñados primordialmente para cometer sabotaje."
        },
        {
            term: "Espionaje informático",
            art: "Capítulo I, Art. 11",
            def: "Prisión de 3 a 6 años y multa de 300 a 600 UT para quien indebidamente obtenga, revele o difunda data o información de un sistema. Aumenta de 1/3 a 1/2 si es por beneficio personal/ajeno, y de 1/2 a 2/3 si pone en peligro la seguridad del Estado, la confiabilidad de instituciones o causa daño."
        },
        {
            term: "Falsificación de documentos informáticos",
            art: "Capítulo I, Art. 12",
            def: "Prisión de 3 a 6 años y multa de 300 a 600 UT por crear, alterar, modificar o forjar un documento informático con aptitud probatoria para alterar la verdad o causar efectos jurídicos."
        },
        {
            term: "Hurto electrónico",
            art: "Capítulo II, Art. 13",
            def: "Prisión de 2 a 6 años y multa de 200 a 600 UT para quien se apodere de bienes o valores ajenos valiéndose de tecnologías de información, sin mediar manipulación de la lógica del sistema."
        },
        {
            term: "Fraude informático",
            art: "Capítulo II, Art. 14",
            def: "Prisión de 3 a 7 años y multa de 300 a 700 UT. Se configura cuando se modifican datos, se insertan instrucciones falsas o se altera el procesamiento de un sistema con el propósito de procurar un provecho injusto en perjuicio ajeno."
        },
        {
            term: "Obtención indebida de bienes o servicios",
            art: "Capítulo II, Art. 15",
            def: "Prisión de 2 a 6 años y multa de 200 a 600 UT para quien, sin autorización para portarlos, utilice una tarjeta inteligente ajena o instrumento similar; o utilice indebidamente tecnologías de información para requerir la obtención de cualquier efecto, bien o servicio; o para proveer su pago sin asumir el compromiso de la contraprestación debida."
        },
        {
            term: "Manejo fraudulento de tarjetas inteligentes",
            art: "Capítulo II, Art. 16",
            def: "Prisión de 5 a 10 años y multa de 500 a 1.000 UT para quien clone, falsifique, altere, retenga indebidamente o utilice instrumentos de pago o tarjetas inteligentes no emitidas a su nombre."
        },
        {
            term: "Comiso de equipos de tarjetas",
            art: "Capítulo II, Art. 19",
            def: "Decomiso obligatorio y destrucción de los instrumentos de pago, plásticos, bandas magnéticas y equipos utilizados para la comisión de los delitos con tarjetas inteligentes."
        },
        {
            term: "Violación de la privacidad de la data",
            art: "Capítulo III, Art. 20",
            def: "Prisión de 2 a 6 años y multa de 200 a 600 UT para quien sin autorización se apodere, copie, modifique o divulgue datos personales contenidos en sistemas, archivos o bases de datos estáticas."
        },
        {
            term: "Violación de la privacidad de las comunicaciones",
            art: "Capítulo III, Art. 21",
            def: "Prisión de 2 a 6 años y multa de 200 a 600 UT para quien mediante tecnologías intercepte, interfiera o desvíe mensajes de datos o señales de comunicación en tránsito por redes de transmisión."
        },
        {
            term: "Revelación indebida de comunicaciones",
            art: "Capítulo III, Art. 22",
            def: "Prisión de 2 a 6 años y multa de 200 a 600 UT para quien revele, difunda o ceda, en todo o en parte, los hechos descubiertos, imágenes, audio o data obtenidos por los medios de los Arts. 20 y 21. Si se realiza con fin de lucro o resulta perjuicio para otro, la pena se aumentará de un tercio a la mitad."
        },
        {
            term: "Apropiación de propiedad intelectual",
            art: "Capítulo V, Art. 25",
            def: "Prisión de 1 a 5 años y multa de 100 a 500 UT para quien sin autorización y con fin económico reproduzca, copie, distribuya, comercialice o modifique un software protegido obtenido de un sistema."
        },
        {
            term: "Oferta engañosa telemática",
            art: "Capítulo V, Art. 26",
            def: "Prisión de 1 a 5 años y multa de 100 a 500 UT para quien ofrezca, comercialice o publicite bienes o servicios mediante tecnologías cuando las cualidades del objeto no correspondan a lo ofertado."
        },
        {
            term: "Agravantes generales (Título III)",
            art: "Título III, Art. 27",
            def: "Aumento de un tercio a la mitad de la pena: 1. Si se hizo uso de contraseña ajena indebidamente obtenida, quitada, retenida o que se hubiere perdido. 2. Si se cometió mediante abuso de la posición de acceso a data o información reservada, o al conocimiento privilegiado de contraseñas, en razón del ejercicio de un cargo o función."
        },
        {
            term: "Sanción especial a personas jurídicas",
            art: "Título III, Art. 28",
            def: "Cuando una persona jurídica sea responsable conforme al Art. 5, la sanción será exclusivamente patrimonial de multa por el doble del monto del delito cometido."
        },
        {
            term: "Penas accesorias",
            art: "Título III, Art. 29",
            def: "El tribunal impondrá: comiso de equipos (Arts. 10 y 19); trabajo comunitario hasta 3 años (Arts. 6 y 8); inhabilitación profesional o empresarial hasta 3 años por abuso de cargo; suspensión de permisos o cargos directivos hasta 3 años en delitos corporativos."
        },
        {
            term: "Expulsión del territorio nacional",
            art: "Título III, Art. 30",
            def: "Cumplida la pena corporal o pecuniaria correspondiente, los extranjeros condenados por estos delitos serán expulsados del territorio de la República sin derecho de reingreso hasta por 10 años."
        },
        {
            term: "Indemnización civil obligatoria",
            art: "Título III, Art. 31",
            def: "En las sentencias condenatorias dictadas por delitos del Capítulo II (propiedad) y Capítulo V (orden económico), el juez fijará inexcusablemente la indemnización por los daños y perjuicios causados, auxiliándose con el dictamen de expertos periciales."
        }
    ]
};
