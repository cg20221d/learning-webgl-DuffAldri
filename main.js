function main() {
    var kanvas = document.getElementById("kanvas");
    var gl = kanvas.getContext("webgl");

    // Vertex shader
    var vertexShaderCode = `
    void main() {
        precision mediump float;
        float x = 0.0;
        float y = 0.0;
        gl_PointSize = 10.0;
        gl_Position = vec4(x, y, 0.0, 1.0); 
    } 
    `; //gl_Position = vec4(x, y, z, w); 
    
    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject); // Sampai sini sudah jadi .0

    // Fragment shader
    var fragmentShaderCode = `
    void main() {
        precision mediump float;
        float r = 0.0;
        float g = 0.0;
        float b = 1.0;
        gl_FragColor = vec4(0.5, 0.0, 1.0, 1.0);
    }
    `;
    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject); // Sampai sini sudah jadi .0

    var shaderProgram = gl.createProgram(); // Wadah dari executable (.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmentShaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawArrays(gl.POINTS, 0, 1);
}

window.onload = main;