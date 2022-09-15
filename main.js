function main() {
    var kanvas = document.getElementById("kanvas");
    var gl = kanvas.getContext("webgl");

    var vertices = [
        0.5, 0.5,   // A: kanan atas
        0.0, 0.0,   // B: bawah tengah
        -0.5, 0.5
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // Define alamat gpu
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Vertex shader
    var vertexShaderCode = `
    attribute vec2 aPosition; // Untuk
    void main() {
        float x = aPosition.x;
        float y = aPosition.y;
        gl_PointSize = 10.0;
        gl_Position = vec4(x, y, 0.0, 1.0); // Untuk mendapatkan x & y, bisa menggunakan x, y atau aPosition.xy atau aPosition
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

    //Kita mengajari GPU bagaimana caranya mengoleksi
    // nilai posisi dari ARRAY_BUFFER
    // untuk setiap verteks yang sedang diproses
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(aPosition);
    gl.clearColor(1, 0.6, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawArrays(gl.LINE_LOOP,     0,      3);
    //          PRIMITIVE,                 banyaknya titik
}

window.onload = main;