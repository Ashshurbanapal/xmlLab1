
/**
 * ������� �� ����� ��������� ���������, ��������� � ����� input.xml.
 */
document.body.onload = function () {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "input.xml", false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;
    var controls = xmlDoc.getElementsByTagName("Parameter");
    for (var i = 0; i < controls.length; i++) {
        addDivForParameter(controls[i].getElementsByTagName("Id")[0].firstChild.nodeValue,
               controls[i].getElementsByTagName("Name")[0].firstChild.nodeValue,
               controls[i].getElementsByTagName("Description")[0].firstChild.nodeValue,
               controls[i].getElementsByTagName("Type")[0].firstChild.nodeValue,
               controls[i].getElementsByTagName("Value")[0].firstChild.nodeValue);
    }
};

/**
 * ��������� ������� div, ������� ���������� ���������� � ��������� ���������.
 * @param {type} parameterName �������� ��������� ���������
 * @param {type} parameterDescription �������� ��������� ���������
 * @param {type} parameterType ��� ��������� ���������.
 *  ���������� ����: System.String, System.Int32, System.Boolean
 * @param {type} parameterValue �������� ��������� ���������, ���������������
 *  ���������� ����
 */
function addDivForParameter(parameterID, parameterName, parameterDescription, parameterType, parameterValue) {
    var div = createDiv("parameter", "");
    div.appendChild(createDiv("parameterName", parameterName));
    div.appendChild(createDiv("parameterID", parameterID));
    div.appendChild(createDiv("parameterDescription", parameterDescription));
    var input = document.createElement('input');
    if (parameterType === "System.String") {
        input.type = "text";
        input.value = parameterValue;
    } else if (parameterType === "System.Int32") {
        input.type = "text";
        input.value = parameterValue;
        input.oninput = validateNumber;
        input.onblur = checkNumberAfterInput;
    } else if (parameterType === "System.Boolean") {
        input.type = "checkbox";
        input.checked = (parameterValue.toLowerCase() === 'true');
    }
    div.appendChild(input);
    var deleteButton = document.createElement('input');
    deleteButton.type = "button";
    deleteButton.value = "Delete";
    deleteButton.onclick = deleteParameter;
    deleteButton.className = "deleteButton";
    div.appendChild(deleteButton);
    document.body.appendChild(div);
};

/**
 * ������� ��������� ������� div � ����������� ���������.
 */
function deleteParameter() {
    this.parentNode.parentNode.removeChild(this.parentNode);
};

/**
 * ������� ������� div.
 * @param {type} classCSS ����� ��������
 * @param {type} text ����� ������ ��������
 * @returns {createDiv.div} ����� ������� div, � �������� ��� ��������
 */
function createDiv(classCSS, text) {
    var div = document.createElement('div');
    div.className = classCSS;
    div.innerHTML = text;
    return div;
};

/**
 * ��������� ������ ���������� � ����� output.xml.
 */
function saveParameters() {
    var outputXML = createOutputXML();
    var link = document.getElementById("linkToOutputXML");
    var file = new Blob([outputXML], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "output.xml";
    document.getElementById('linkToOutputXML').click();
};

/**
 * ������� ����� ���� �� ����� ����������� ����������.
 */
function createOutputXML() {
    var parameters = document.getElementsByClassName("parameter");
    var xmlDoc = "<?xml version=\"1.0\"?>\n" + "<Parameters>\n";
    for (var i = 0; i < parameters.length; i++) {
        xmlDoc += "<Parameter>\n";
        xmlDoc += "<Id>" + parameters[i].firstChild.innerHTML + "</Id>\n";
        xmlDoc += "<Name>" + parameters[i].childNodes[1].innerHTML + "</Name>\n";
        xmlDoc += "<Description>" + parameters[i].childNodes[2].innerHTML + "</Description>\n";
        xmlDoc += "<Type>System." + getParameterType(parameters[i].childNodes[3]) + "</Type>\n";
        xmlDoc += "<Value>" + parameters[i].childNodes[3].value + "</Value>\n</Parameter>\n";
    }
    xmlDoc += "</Parameters>";
    return xmlDoc;
};

/**
 * ���������� ��� ��������� �������� ��� ���������.
 */
function getParameterType(input) {
    if (input.type === "checkbox")
        return "Boolean";
    if (input.oninput === null)
        return "String";
    return "Int32";
};

/**
 * ���������� div-������� � ����������� ���������.
 */
function showParameterSettings() {
    document.getElementById("newParameter").style.display = "block";
};

/**
 * ������ ��������� ���������, ������� � ���������� �� ��� ����� ��������.
 */
function showNewParameter() {
    var parameterID = document.getElementById("parameterID").value;
    var parameterName = document.getElementById("parameterName").value;
    var parameterDescription = document.getElementById("parameterDescription").value;
    var types = ["System.String", "System.Int32", "System.Boolean"];
    var parameterType = types[document.getElementById("parameterType").selectedIndex];
    var inputWithParameterValue = document.getElementById("parameterValue");
    var parameterValue;
    if (inputWithParameterValue.type === "checkbox")
        parameterValue = inputWithParameterValue.checked.toString();
    else
        parameterValue = inputWithParameterValue.value;
    addDivForParameter(parameterID, parameterName, parameterDescription, parameterType, parameterValue);
    document.getElementById("newParameter").style.display = "none";
};

/**
 * �������� div-������� � ����������� ���������.
 */
function cancelNewParameter() {
    document.getElementById("newParameter").style.display = "none";
};

/**
 * �������� ���� ����� �������� ��������� � ����������� �� ���� ���������.
 */
function setInputType() {
    var combobox = document.getElementById("parameterType");
    var input = document.getElementById("parameterValue");
    input.oninput = null;
    if (combobox.selectedIndex === 0)
        input.type = "text";
    else if (combobox.selectedIndex === 1) {
        input.type = "text";
        input.oninput = validateNumber;
        input.onblur = checkNumberAfterInput;
    }
    else
        input.type = "checkbox";
};

/**
 * ���������, ���� �� ������������ ����� ����� � ������� �� ��������� ������ ������ �������.
 */
function validateNumber() {
    if (this.value === "-")
        return;
    this.style.backgroundColor = "white";
    if (!/\-?\d+$/.test(this.value)) {
        var substring = this.value.substring(0, this.value.length - 1);
        if (/\-?\d+$/.test(substring))
            this.value = substring;
        else
            this.value = "";
    }
    var intValue = parseInt(this.value);
    if (isNaN(intValue))
        this.value = "";
    else
        this.value = intValue;
    if (this.value.length > 10)
        this.value = this.value.substring(0, 10);
};

function checkNumberAfterInput() {
    if (this.value === "-")
        this.style.backgroundColor = "red";
};
