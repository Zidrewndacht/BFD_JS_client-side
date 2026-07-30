const corOriginal = document.getElementById("ret-wrapper").style.background

function calcRet(){
    let area, perim;
    const ladoA = document.getElementById("entrada-lado-a").value;
    const ladoB = document.getElementById("entrada-lado-b").value;

    if( ladoA < 0 || ladoB < 0){
        document.getElementById("result-area").value = "Não pode né";
        document.getElementById("result-perim").value = "Não pode né";
        document.getElementById("ret-wrapper").style.background = "#e99";
    } else {
        area = ladoA * ladoB;
        perim = 2*ladoA + 2*ladoB;
        document.getElementById("result-area").value = area;
        document.getElementById("result-perim").value = perim;
        document.getElementById("ret-wrapper").style.background = corOriginal;
    }
}


function ctof(){
    const tempc = document.getElementById("entrada-tempc").value;

    if (tempc < -273.15){
        document.getElementById("result-tempf").value = "abaixo de 0 Kelvin não, né.";
        document.getElementById("ctof-wrapper").style.background = "#e99";
    } else {
        let tempf = (tempc * 9 / 5 ) + 32;
        document.getElementById("result-tempf").value = tempf.toFixed(2);
        document.getElementById("ctof-wrapper").style.background = corOriginal;
    }

}


function imc(){
    const altura = parseFloat(document.getElementById("altura").value)/100;
    const peso = parseFloat(document.getElementById("peso").value);
    const resultado = document.getElementById("resultado");
    const valorIMC = document.getElementById("valor-imc");

    if( altura < 1 || peso < 10 || altura > 3 || peso > 500){
        resultado.value = "Dimensões inválidas";
        valorIMC.value = "0";
        document.getElementById("wrapper-3").style.background = "#e99";
    } else {
        let imc = peso / Math.pow(altura, 2);
        valorIMC.value = imc.toFixed(2);
        document.getElementById("wrapper-3").style.background = corOriginal;

        if      (imc < 18.5) { resultado.value = "Abaixo do normal"; }
        else if (imc < 24.9) { resultado.value = "Normal";           }
        else                 { resultado.value = "Acima do normal";  }
    }
}

function bissexto(){
    const ano = document.getElementById("entrada-bis").value
    const result = document.getElementById("result-bis");
    /** O ano é bissexto se for divisível por 400, ou
     *  se for divisível por 4 mas não por 100.
     */
    if ( ano % 400 === 0 || ( ano % 4 === 0 && ano % 100 !== 0 ) ){
        result.value = "O ano é bissexto"
        document.getElementById("wrapper-4").style.background = "#9e9";
    } else {
        result.value = "O ano não é bissexto"
        document.getElementById("wrapper-4").style.background = corOriginal;
    }
}

document.getElementById("entrada-bis").addEventListener("change", bissexto);

document.getElementById("calcula-imc").addEventListener("click",imc)

document.getElementById("entrada-lado-a").addEventListener("change", calcRet);
document.getElementById("entrada-lado-b").addEventListener("change", calcRet);

document.getElementById("entrada-tempc").addEventListener("change", ctof);


