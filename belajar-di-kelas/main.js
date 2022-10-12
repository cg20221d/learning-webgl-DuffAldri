function main() {
    var kanvas = document.getElementById("kanvas");
    var gl = kanvas.getContext("webgl");

    var vertices = [
        0.5,
        0,
        0.0,
        1.0,
        1.0, // A: CYAN
        0.0,
        -0.5,
        1.0,
        0.0,
        1.0, // B: MAGENTA
        -0.5,
        0,
        1.0,
        1.0,
        0.0, // C: KUNING
        0.0,
        0.5,
        1.0,
        1.0,
        1.0, // PUTIH
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // Define alamat gpu
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Vertex shader
    var vertexShaderCode = `
    attribute vec2 aPosition; // Untuk posisi titiknya
    attribute vec3 aColor;
    uniform float uTheta;
    uniform float uHorizontal;
    uniform float uVertical;
    varying vec3 vColor;

    void main() {
        // float x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y + uHorizontal;
        // float y = sin(uTheta) * aPosition.y + cos(uTheta) * aPosition.x + uVertical;
        // gl_Position = vec4(x, y, 0.0, 1.0); // Untuk mendapatkan x & y, bisa menggunakan x, y atau aPosition.xy atau aPosition
        
        // Belajar translasi object
        vec2 position = aPosition;
        vec3 d = vec3(0.5, -0.5, 0.0);
        mat4 translation = mat4(1.0, 0.0, 0.0, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0,
                                d.x, d.y, d.z, 1.0);

        // Belajar rotasi object
        mat4 rotation = mat4(
            cos(uTheta), sin(uTheta), 0.0, 0.0,
            -sin(uTheta), cos(uTheta), 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);

        gl_Position = translation * rotation * vec4(position, 0.0, 1.0);
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
    var horizontal = 0.0;
    var vertical = 0.0;
    var freeze = false;

    // Variabel pointer ke GLSL
    var uTheta = gl.getUniformLocation(shaderProgram, "uTheta");
    var uHorizontal = gl.getUniformLocation(shaderProgram, "uHorizontal");
    var uVertical = gl.getUniformLocation(shaderProgram, "uVertical");

    //Kita mengajari GPU bagaimana caranya mengoleksi
    // nilai posisi dari ARRAY_BUFFER
    // untuk setiap verteks yang sedang diproses

    // Atribut untuk posisi
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(
        aPosition,
        2,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT, // Untuk alokasi memori, dikali dengan size memorynya. Dalam konteks ini menggunakan Float32Array
        0
    );
    gl.enableVertexAttribArray(aPosition);

    // Atribut untuk warna
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(
        aColor,
        3,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT, // Untuk alokasi memori, dikali dengan size memorynya. Dalam konteks ini menggunakan Float32Array
        2 * Float32Array.BYTES_PER_ELEMENT
    ); // 2 karena ...
    gl.enableVertexAttribArray(aColor);

    function onMouseClick(event) {
        freeze = !freeze;
    }

    document.addEventListener("click", onMouseClick, false);

    function onKeyDown(event) {
        if (event.keyCode == 87) {
            // W
        } else if (event.keyCode == 65) {
            // A
            uHorizontal = -0.001;
        } else if (event.keyCode == 83) {
            // S
        } else if (event.keyCode == 68) {
            // D
        }
    }
    document.addEventListener("keydown", onKeyDown, false);

    function onKeyDown(event) {
        if (event.keyCode == 87) {
            // W
            uVertical = 0;
        } else if (event.keyCode == 65) {
            // A
            uHorizontal = 0;
        } else if (event.keyCode == 83) {
            // S
            uVertical = 0;
        } else if (event.keyCode == 68) {
            // D
            uHorizontal = 0;
        }
    }
    document.addEventListener("keydown", onKeyDown, false);

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
        // Uncomment di bawah ini
        if (!freeze) {
            theta += 0.01; // + itu counter-clockwise, - clockwise
            gl.uniform1f(uTheta, theta);
        }

        // gl.uniform1f(uHorizontal, horizontal);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        //          PRIMITIVE,                 banyaknya titik

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render); // Dengan menggunakan requestAnimationFrame, browser akan berhenti selama 1/60 detik setelah menjalankan fungsi

    // setInterval(render, 1000/120) // Cara 1, panggil fungsi tiap 1000/60 ms atau 1/60 detik
}

window.onload = main;
