function convierte_cifra(numero, sw) {
    const lista_centana = ["", ["CIEN", "CIENTO"], "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS",
        "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"
    ];
    const lista_decena = ["", ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"],
        ["VEINTE", "VEINTI"],
        ["TREINTA", "TREINTA Y "],
        ["CUARENTA", "CUARENTA Y "],
        ["CINCUENTA", "CINCUENTA Y "],
        ["SESENTA", "SESENTA Y "],
        ["SETENTA", "SETENTA Y "],
        ["OCHENTA", "OCHENTA Y "],
        ["NOVENTA", "NOVENTA Y "]
    ];
    const lista_unidad = ["", ["UN", "UNO"], "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const centena = parseInt(numero / 100);
    const decena = parseInt((numero - (centena * 100)) / 10);
    const unidad = parseInt(numero - (centena * 100 + decena * 10));

    let texto_centena = "";
    let texto_decena = "";
    let texto_unidad = "";

    // # Validad las centenas
    texto_centena = lista_centana[centena];
    if (centena == 1) {
        if ((decena + unidad) != 0)
            texto_centena = texto_centena[1];
        else
            texto_centena = texto_centena[0];
    }

    // # Valida las decenas
    texto_decena = lista_decena[decena];
    if (decena == 1)
        texto_decena = texto_decena[unidad];
    else if (decena > 1) {
        if (unidad != 0)
            texto_decena = texto_decena[1];
        else
            texto_decena = texto_decena[0];
    }
    // # Validar las unidades
    if (decena != 1) {
        texto_unidad = lista_unidad[unidad];
        if (unidad == 1)
            texto_unidad = texto_unidad[sw];
    }
    return `${texto_centena} ${texto_decena} ${texto_unidad}`;
}

function numero_to_letras(numero) {
    const indicador = [
        ["", ""],
        ["MIL", "MIL"],
        ["MILLON", "MILLONES"],
        ["MIL", "MIL"],
        ["BILLON", "BILLONES"]
    ];
    numero = parseFloat(numero);
    let entero = parseInt(numero);
    const decimal = parseInt(Math.round((((numero - entero) * 100)) + Number.EPSILON));
    let contador = 0;
    let numero_letras = "";
    while (entero > 0) {
        const a = entero % 1000;
        if (contador == 0)
            en_letras = convierte_cifra(a, 1).trim();
        else
            en_letras = convierte_cifra(a, 0).trim();
        if (a == 0)
            numero_letras = en_letras + " " + numero_letras;
        else if (a == 1) {
            if ([1, 3].includes(contador))
                numero_letras = indicador[contador][0] + " " + numero_letras;
            else
                numero_letras = en_letras + " " + indicador[contador][0] + " " + numero_letras;
        } else
            numero_letras = en_letras + " " + indicador[contador][1] + " " + numero_letras;
        numero_letras = numero_letras.trim();
        contador = contador + 1;
        entero = parseInt(entero / 1000);
    }
    if (numero_letras === "") numero_letras = "CERO";
    numero_letras = numero_letras + " Y " + decimal + "/100 SOLES";
    return numero_letras;
}

x = numero_to_letras(1564.55);
console.log(x);