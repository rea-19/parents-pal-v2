
$("#cost-slider").ionRangeSlider({
    skin: "round",
    type: "double",       
    min: 0,
    max: 100,
    from: 0,             
    to: 50,            
    prefix: "$",
    grid: true,
    onFinish: function(data) {
        filterEvents();
    }
});


$("#quiz-cost-slider").ionRangeSlider({
    skin: "round",
    type: "double",
    min: 0,
    max: 100,
    from: 0,
    to: 50,
    prefix: "$",
    grid: true,
    onFinish: function(data) {
        $("#quiz-price-min").val(data.from);
        $("#quiz-price-max").val(data.to);
    }
});

function setupRangeSlider(minSliderId, maxSliderId, minInputId, maxInputId) {
    const minSlider = document.getElementById(minSliderId);
    const maxSlider = document.getElementById(maxSliderId);
    const minInput = document.getElementById(minInputId);
    const maxInput = document.getElementById(maxInputId);

    function syncSliders() {
        let minVal = parseFloat(minSlider.value);
        let maxVal = parseFloat(maxSlider.value);

        if(minVal > maxVal) minVal = maxVal;
        if(maxVal < minVal) maxVal = minVal;

        minSlider.value = minVal;
        maxSlider.value = maxVal;

        minInput.value = minVal;
        maxInput.value = maxVal;
    }

    function syncInputs() {
        let minVal = parseFloat(minInput.value) || 0;
        let maxVal = parseFloat(maxInput.value) || 100;

        if(minVal > maxVal) minVal = maxVal;
        if(maxVal < minVal) maxVal = minVal;

        minSlider.value = minVal;
        maxSlider.value = maxVal;
    }

    minSlider.addEventListener("input", syncSliders);
    maxSlider.addEventListener("input", syncSliders);
    minInput.addEventListener("input", syncInputs);
    maxInput.addEventListener("input", syncInputs);
}


setupRangeSlider("cost-range-min","cost-range-max","cost-min","cost-max");

setupRangeSlider("quiz-range-min","quiz-range-max","quiz-price-min","quiz-price-max");



