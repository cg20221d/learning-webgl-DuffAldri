function main() {
    var kanvas = document.getElementById("kanvas");
    var gl = kanvas.getContext("webgl");

    var vertices = [
        0.5, 0.5, 0.0, 1.0, 1.0,  // A: CYAN
        0.0, 0.0, 1.0, 0.0, 1.0,// B: MAGENTA
        -0.5, 0.5, 1.0, 1.0, 0.0,// C: KUNING
        0.0, 1.0, 1.0, 1.0, 1.0 // PUTIH
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // Define alamat gpu
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Vertex shader
    var vertexShaderCode = `
    attribute vec2 aPosition; // Untuk posisi titiknya
    attribute vec3 aColor;
    uniform float uTheta;
    varying vec3 vColor;

    void main() {
        float x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y;
        float y = sin(uTheta) * aPosition.y + cos(uTheta) * aPosition.x;
        gl_Position = vec4(x, y, 0.0, 1.0); // Untuk mendapatkan x & y, bisa menggunakan x, y atau aPosition.xy atau aPosition
        vColor = aColor;
    } 
    `; //gl_Position = vec4(x, y, z, w); 
    
    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject); // Sampai sini sudah jadi .0

    // Fragment shader
    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    void main() {
        // float r = 0.0;
        // float g = 0.0;
        // float b = 1.0;
        gl_FragColor = vec4(vColor, 1.0);
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

    // Variabel lokal
    var theta = 0.0;
    
    // Variabel pointer ke GLSL
    var uTheta = gl.getUniformLocation(shaderProgram, "uTheta");

    //Kita mengajari GPU bagaimana caranya mengoleksi
    // nilai posisi dari ARRAY_BUFFER
    // untuk setiap verteks yang sedang diproses

    // Atribut untuk posisi
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 
        5 * Float32Array.BYTES_PER_ELEMENT, // Untuk alokasi memori, dikali dengan size memorynya. Dalam konteks ini menggunakan Float32Array 
        0)
    gl.enableVertexAttribArray(aPosition);

    // Atribut untuk warna
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 
        5 * Float32Array.BYTES_PER_ELEMENT, // Untuk alokasi memori, dikali dengan size memorynya. Dalam konteks ini menggunakan Float32Array 
        2 * Float32Array.BYTES_PER_ELEMENT); // 2 karena ...
    gl.enableVertexAttribArray(aColor);

    function render() {
        // // Cara 2, menggunakan timeout
        // setTimeout(function() {
        //     gl.clearColor(1, 0.6, 0, 1.0);
        //     gl.clear(gl.COLOR_BUFFER_BIT);
            
        //     theta += 0.1; // + itu counter-clockwise, - clockwise
        //     gl.uniform1f(uTheta, theta);

        //     gl.drawArrays(gl.TRIANGLE_FAN ,     0,      4);
        //     //          PRIMITIVE,                 banyaknya titik
        // }, 10000/60) // FPS: 60fps

        // Cara 1 (menggunakan setInterval()) & 3 (menggunakan requestAnimationFrame)
        gl.clearColor(1, 0.6, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        theta += 0.0005; // + itu counter-clockwise, - clockwise
        gl.uniform1f(uTheta, theta);

        gl.drawArrays(gl.TRIANGLE_FAN ,     0,      4);
        //          PRIMITIVE,                 banyaknya titik

        // requestAnimationFrame(render);
    }
    // requestAnimationFrame(render); // Dengan menggunakan requestAnimationFrame, browser akan berhenti selama 1/60 detik setelah menjalankan fungsi

    setInterval(render, 1000/120) // Cara 1, panggil fungsi tiap 1000/60 ms atau 1/60 detik



}

window.onload = main;