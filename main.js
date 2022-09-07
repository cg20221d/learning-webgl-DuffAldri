function main() {
    var kanvas = document.getElementById("kanvas");
    var gl = kanvas.getContext("webgl");

    // Vertex shader
    var vertexShaderCode = 
    "void main(" +
    "}";

    
    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject); // Sampai sini sudah jadi .0

    // Fragment shader
    var fragmentShaderCode = `
    void main() {

    }
    `
    var fragmentShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject); // Sampai sini sudah jadi .0

    var shaderProgram = gl.createProgram(); // Wadah dari executable (.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmentShaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    gl.clearColor(0.1, 0.5, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
}

window.onload = main;