function main() {
    var canvas = document.getElementById("canvas");

    var gl = canvas.getContext("webgl");

    gl.clearColor(1, 0, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);


    var vertexShaderCode = `
        attribute vec2 aPosition;
        void main() {
            gl_Position = vec4(aPosition, 0, 1);
        }
    `
    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject);

    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    var fragmentShaderCode = `
        precision mediump float;
        uniform vec4 color;
        void main() {
            gl_FragColor = color
        }

    `
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject);
    
    var program = gl.createProgram();
    gl.attachShader(program, vertexShaderObject);
    gl.attachShader(program, fragmentShaderObject);
    gl.linkProgram(program);

    var vertices = new Float32Array([
        -0.5, -0.5, 
        0.5, -0.5,
        0.0, 0.5
    ])

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(program);
    program.color = gl.getUniformLocation(program, 'color');
    gl.uniform4fv(program.color, [0, 1, 0, 1.0]);

    program.position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(program.position);
    gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);
}

window.onload = main;