/**
 * Created by zhouchunfeng on 2017/9/18.
 */
$(function () {
    var cameraBg,sceneBg,rendererBg;

    var maxParticleCount = 1000;
    var particleCount =200;
    var r = 2400;
    var rHalf = r / 2;
    var particlesData = [];
    var effectController = {
        showDots: false,
        showLines: false,
        minDistance:350,
        limitConnections: false,
        maxConnections: 20,
        particleCount:20
    };


    document.addEventListener('touchstart',function (ev) {ev.preventDefault();},{ passive: false });
    document.addEventListener('touchmove',function (ev) {ev.preventDefault();},{ passive: false });


    init();
    animate();
    var drags=[];
    for(var i = 0 ; i < 24 ; i++){
        drags[i] = new DragEleByTouch('.box'+(i+1));
        drags[i].translate(Math.random()*8000,Math.random()*1800);
        drags[i].rotate(Math.random()*360);
        var scaleValue = Math.random()*100+50;
        drags[i].scale(scaleValue,scaleValue);
    }

    function init() {

        //背景层
        bgContainer = document.getElementById( 'bgWebGL' );

        //

        cameraBg = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
        cameraBg.position.z = 2000;


        sceneBg = new THREE.Scene();

        sceneBg.fog = new THREE.FogExp2( 0xdddddd ,0.0005);


        bgGroup = new THREE.Group();
        sceneBg.add( bgGroup );

        var segments = maxParticleCount * maxParticleCount;

        positions = new Float32Array( segments * 3 );
        colors = new Float32Array( segments * 3 );

        var pMaterial = new THREE.PointsMaterial( {
            color: 0xFFFFFF,
            size: 3,
            blending: THREE.AdditiveBlending,
            transparent: true,
            sizeAttenuation: false,
            opacity:0.5
        } );

        particles = new THREE.BufferGeometry();
        particlePositions = new Float32Array( maxParticleCount * 3 );

        for ( var i = 0; i < maxParticleCount; i++ ) {

            var x = Math.random() * r - r / 2;
            var y = Math.random() * r- r / 2;
            var z = Math.random() * r - r / 2;
            // x = x>=0?x+500:x-500;
            // y = y>=0?y+500:y-500;
            particlePositions[ i * 3     ] = x;
            particlePositions[ i * 3 + 1 ] = y;
            particlePositions[ i * 3 + 2 ] = z;

            // add it to the geometry
            particlesData.push( {
                velocity: new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 ),
                numConnections: 0
            } );

        }

        particles.setDrawRange( 0, particleCount );
        particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );

        // create the particle system
        pointCloud = new THREE.Points( particles, pMaterial );
        bgGroup.add( pointCloud );

        var geometry = new THREE.BufferGeometry();

        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) );
        geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );

        geometry.computeBoundingSphere();

        geometry.setDrawRange( 0, 0 );

        var material = new THREE.LineBasicMaterial( {
            vertexColors: THREE.VertexColors,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity:0.3
        } );

        linesMesh = new THREE.LineSegments( geometry, material );
        bgGroup.add( linesMesh );

        //

        rendererBg = new THREE.WebGLRenderer( { antialias: true ,alpha:true} );
        rendererBg.setPixelRatio( window.devicePixelRatio*0.5 );
        rendererBg.setSize(window.innerWidth , window.innerHeight);

        rendererBg.gammaInput = true;
        rendererBg.gammaOutput = true;

        bgContainer.appendChild( rendererBg.domElement );

        window.addEventListener('resize', onWindowResize, false);


    }
    function onWindowResize() {

        cameraBg.aspect = window.innerWidth / window.innerHeight;
        cameraBg.updateProjectionMatrix();

        rendererBg.setSize(window.innerWidth, window.innerHeight);


    }

    function animate() {
        var vertexpos = 0;
        var colorpos = 0;
        var numConnected = 0;

        for ( var i = 0; i < particleCount; i++ )
            particlesData[ i ].numConnections = 0;

        for ( var i = 0; i < particleCount; i++ ) {

            // get the particle
            var particleData = particlesData[i];
            particlePositions[ i * 3] += particleData.velocity.x;
            particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
            particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

            if ( particlePositions[ i * 3 + 1 ] < -rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
                particleData.velocity.y = -particleData.velocity.y;

            if ( particlePositions[ i * 3 ] < -rHalf || particlePositions[ i * 3 ] > rHalf )
                particleData.velocity.x = -particleData.velocity.x;

            if ( particlePositions[ i * 3 + 2 ] < -rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
                particleData.velocity.z = -particleData.velocity.z;

            if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
                continue;

            // Check collision
            for ( var j = i + 1; j < particleCount; j++ ) {

                var particleDataB = particlesData[ j ];
                if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
                    continue;

                var dx = particlePositions[ i * 3     ] - particlePositions[ j * 3     ];
                var dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
                var dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
                var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

                if ( dist < effectController.minDistance ) {

                    particleData.numConnections++;
                    particleDataB.numConnections++;

                    var alpha = 1.0 - dist / effectController.minDistance;

                    positions[ vertexpos++ ] = particlePositions[ i * 3     ];
                    positions[ vertexpos++ ] = particlePositions[ i * 3 + 1 ];
                    positions[ vertexpos++ ] = particlePositions[ i * 3 + 2 ];

                    positions[ vertexpos++ ] = particlePositions[ j * 3     ];
                    positions[ vertexpos++ ] = particlePositions[ j * 3 + 1 ];
                    positions[ vertexpos++ ] = particlePositions[ j * 3 + 2 ];

                    colors[ colorpos++ ] = alpha;
                    colors[ colorpos++ ] = alpha;
                    colors[ colorpos++ ] = alpha;

                    colors[ colorpos++ ] = alpha;
                    colors[ colorpos++ ] = alpha;
                    colors[ colorpos++ ] = alpha;

                    numConnected++;
                }
            }
        }


        linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
        linesMesh.geometry.attributes.position.needsUpdate = true;
        linesMesh.geometry.attributes.color.needsUpdate = true;

        pointCloud.geometry.attributes.position.needsUpdate = true;
        requestAnimationFrame(animate);

        render();
    }

    function render() {
        rendererBg.render(sceneBg, cameraBg);

    }
});