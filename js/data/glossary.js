window.Game = window.Game || {};

// Glosario técnico y marco legal - Ley Especial contra los Delitos Informáticos (Gaceta Oficial N.° 37.313)
window.Game.GLOSSARY = {
    definitions: [
        {
            term: "Sistema",
            art: "Art. 2, lit. a",
            def: "Arreglo organizado de recursos y procedimientos diseñados para el uso de tecnologías de información, unidos por interacción o interdependencia para cumplir funciones específicas o integrar componentes en un paquete funcional."
        },
        {
            term: "Data (datos)",
            art: "Art. 2, lit. b",
            def: "Hechos, conceptos, instrucciones o caracteres representados para ser comunicados, transmitidos o procesados por humanos o medios automáticos, a los cuales se asigna o puede asignarse significado."
        },
        {
            term: "Información",
            art: "Art. 2, lit. c",
            def: "Significado que el ser humano le asigna a la data utilizando convenciones conocidas y generalmente aceptadas."
        },
        {
            term: "Documento",
            art: "Art. 2, lit. d",
            def: "Registro incorporado en un sistema (escrito, video, audio u otro medio) que contiene data o información sobre un hecho o acto capaz de causar efectos jurídicos."
        },
        {
            term: "Hardware",
            art: "Art. 2, lit. e",
            def: "Equipos o dispositivos físicos considerados independientemente de su capacidad o función, que conforman un computador o sus componentes periféricos (herramientas, implementos, conexiones, ensamblajes y partes)."
        },
        {
            term: "Software",
            art: "Art. 2, lit. f",
            def: "Información organizada en programas de computación, procedimientos y documentación asociados para operar un sistema y proveer instrucciones y data al computador."
        },
        {
            term: "Seguridad",
            art: "Art. 2, lit. g",
            def: "Condición resultante de medidas de protección que garantizan inviolabilidad frente a influencias o actos hostiles que propicien accesos no autorizados o afecten la operatividad del sistema."
        },
        {
            term: "Virus",
            art: "Art. 2, lit. h",
            def: "Programa o segmento de programa indeseado que se desarrolla incontroladamente y genera efectos destructivos o perturbadores en un programa o componente del sistema."
        },
        {
            term: "Tarjeta inteligente",
            art: "Art. 2, lit. i",
            def: "Rótulo, cédula o carnet usado como instrumento de identificación, acceso a un sistema, pago o crédito, que contiene data o información de uso restringido al usuario autorizado."
        },
        {
            term: "Contraseña (password)",
            art: "Art. 2, lit. j",
            def: "Secuencia alfabética, numérica o combinada, protegida por confidencialidad, utilizada para verificar la autenticidad de la autorización expedida a un usuario para acceder a data o información."
        },
        {
            term: "Mensaje de datos",
            art: "Art. 2, lit. k",
            def: "Pensamiento, idea, imagen, audio, data o información, en lenguaje explícito o encriptado, preparado en formato adecuado para transmitirse por un sistema de comunicaciones."
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
            def: "Reducción de pena entre un tercio y la mitad. Aplica exclusivamente si el sabotaje del Art. 7 se facilitó por imprudencia, negligencia o impericia del personal de custodia o administración (ausencia de dolo directo)."
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
            def: "Prisión de 3 a 6 años y multa de 300 a 600 UT. Requiere expresamente la obtención, difusión o comercialización indebida de data o información clasificada que comprometa la seguridad del Estado o intereses de la República."
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
            def: "Prisión de 1 a 5 años y multa de 10 a 50 UT por acceder, consumir o disfrutar de bienes o servicios ajenos sin el pago correspondiente, valiéndose de mecanismos electrónicos."
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
            def: "Prisión de 2 a 5 años y multa de 200 a 500 UT por divulgar la data interceptada. Aparte único: si la revelación o cesión se efectúa con fin de lucro económico, la pena se incrementa entre 1/3 y 1/2."
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
            def: "Aumento de 1/3 a 1/2 de la pena en caso de: uso de contraseña ajena (obtenida, quitada, retenida o perdida); abuso de funciones o prevalimiento de cargo con acceso privilegiado; o vulneración de correspondencia mercantil."
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
