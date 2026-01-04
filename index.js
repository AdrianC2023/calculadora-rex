// Estado de la aplicación
const state = {
    precioDolarArs: "",
    dolares: "",
    bolivianosUsd: "",
    bolivianosArs: "",
    pesosArgentinosManual: "",
    autoCalculateArs: true
};

// Elementos del DOM
const elements = {
    precioDolarArs: document.getElementById("precio-dolar-ars"),
    dolares: document.getElementById("dolares"),
    bolivianosUsd: document.getElementById("bolivianos-usd"),
    bolivianosArs: document.getElementById("bolivianos-ars"),
    pesosArgentinos: document.getElementById("pesos-argentinos"),
    autoCalculate: document.getElementById("auto-calculate"),
    resultadoUsd: document.getElementById("resultado-usd"),
    resultadoArs: document.getElementById("resultado-ars"),
    comparisonCard: document.getElementById("comparison-card"),
    comparisonText: document.getElementById("comparison-text"),
    comparisonDiff: document.getElementById("comparison-diff")
};

// Convierte formato español (1.234,56) a número (1234.56)
function formatoEspanolANumero(valor) {
    if (!valor) return 0;
    // Eliminar puntos (separadores de miles) y reemplazar coma por punto
    const numeroLimpio = valor.replace(/\./g, "").replace(",", ".");
    return parseFloat(numeroLimpio) || 0;
}

// Convierte número (1234.56) a formato español (1.234,56)
function numeroAFormatoEspanol(numero) {
    return numero.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// Valida y formatea la entrada numérica
function handleNumberInput(value, setter) {
    // Permitir solo números, puntos (miles), comas (decimales)
    // Regex: permite dígitos, puntos para miles, y una sola coma para decimales
    if (value === "" || /^[\d.]*,?\d*$/.test(value)) {
        setter(value);
    }
}

// Actualiza el estado y recalcula
function updateState(key, value) {
    state[key] = value;
    calculate();
}

// Calcula los resultados
function calculate() {
    const precioDolarArsNum = formatoEspanolANumero(state.precioDolarArs);
    const dolaresNum = formatoEspanolANumero(state.dolares);
    const bolivianosUsdNum = formatoEspanolANumero(state.bolivianosUsd);
    const bolivianosArsNum = formatoEspanolANumero(state.bolivianosArs);
    const pesosArgentinosManualNum = formatoEspanolANumero(state.pesosArgentinosManual);

    const pesosArgentinos = state.autoCalculateArs 
        ? precioDolarArsNum * dolaresNum 
        : pesosArgentinosManualNum;

    const resultadoUsd = dolaresNum * bolivianosUsdNum;
    const resultadoArs = pesosArgentinos * bolivianosArsNum;

    // Actualizar resultados
    elements.resultadoUsd.textContent = numeroAFormatoEspanol(resultadoUsd);
    elements.resultadoArs.textContent = numeroAFormatoEspanol(resultadoArs);

    // Actualizar campo de pesos argentinos si está en modo automático
    if (state.autoCalculateArs) {
        elements.pesosArgentinos.value = pesosArgentinos > 0 
            ? numeroAFormatoEspanol(pesosArgentinos) 
            : "";
    }

    // Mostrar comparación
    updateComparison(resultadoUsd, resultadoArs);
}

// Actualiza la tarjeta de comparación
function updateComparison(resultadoUsd, resultadoArs) {
    if (resultadoUsd > 0 || resultadoArs > 0) {
        elements.comparisonCard.classList.remove("hidden");
        
        if (resultadoUsd > resultadoArs) {
            elements.comparisonText.textContent = "¡Conviene Dólares!";
            elements.comparisonDiff.textContent = `Diferencia: ${numeroAFormatoEspanol(resultadoUsd - resultadoArs)} Bs.`;
        } else if (resultadoArs > resultadoUsd) {
            elements.comparisonText.textContent = "¡Conviene Pesos Argentinos!";
            elements.comparisonDiff.textContent = `Diferencia: ${numeroAFormatoEspanol(resultadoArs - resultadoUsd)} Bs.`;
        } else {
            elements.comparisonText.textContent = "¡Ambos tienen el mismo valor!";
            elements.comparisonDiff.textContent = "Los resultados son iguales";
        }
    } else {
        elements.comparisonCard.classList.add("hidden");
    }
}

// Event listeners
elements.precioDolarArs.addEventListener("input", (e) => {
    handleNumberInput(e.target.value, (val) => {
        state.precioDolarArs = val;
        elements.precioDolarArs.value = val;
        calculate();
    });
});

elements.dolares.addEventListener("input", (e) => {
    handleNumberInput(e.target.value, (val) => {
        state.dolares = val;
        elements.dolares.value = val;
        calculate();
    });
});

elements.bolivianosUsd.addEventListener("input", (e) => {
    handleNumberInput(e.target.value, (val) => {
        state.bolivianosUsd = val;
        elements.bolivianosUsd.value = val;
        calculate();
    });
});

elements.bolivianosArs.addEventListener("input", (e) => {
    handleNumberInput(e.target.value, (val) => {
        state.bolivianosArs = val;
        elements.bolivianosArs.value = val;
        calculate();
    });
});

elements.pesosArgentinos.addEventListener("input", (e) => {
    if (!state.autoCalculateArs) {
        handleNumberInput(e.target.value, (val) => {
            state.pesosArgentinosManual = val;
            elements.pesosArgentinos.value = val;
            calculate();
        });
    }
});

elements.autoCalculate.addEventListener("change", (e) => {
    state.autoCalculateArs = e.target.checked;
    elements.pesosArgentinos.readOnly = state.autoCalculateArs;
    elements.pesosArgentinos.classList.toggle("readonly", state.autoCalculateArs);
    
    if (state.autoCalculateArs) {
        elements.pesosArgentinos.value = "";
        state.pesosArgentinosManual = "";
    }
    
    calculate();
});

// Inicializar estado del campo de pesos argentinos
elements.pesosArgentinos.readOnly = state.autoCalculateArs;

