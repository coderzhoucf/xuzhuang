/**
 * Created by zhouchunfeng on 2018/3/23.
 */
window.onload = function () {
    var mySwiper = new Swiper('.infoWarp', {
        'direction':'horizontal',
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next'
    });

    var container,
        camera,
        scene,
        renderer,
        lon = -90,
        lat = 38,
        phi = 0,
        theta = 0,
        cameraR = 5000,
        cameraFov = 5,
        target = new THREE.Vector3(0, 0, 0),
        onPointerDownPointerX,
        onPointerDownPointerY,
        onPointerDownLon,
        onPointerDownLat,
        webGLW = $('#webGL').width(),
        webGLH = $('#webGL').height(),
        raycaster = new THREE.Raycaster(),
        mouse = new THREE.Vector2(),
        isUserInteracting = false,
        isMoving = false,
        materials = [],
        materials00 = [],
        materials01 = [],
        materials02 = [],
        topObjects = [],
        leftObjects = [],
        rightObjects = [],
        targetPositions = [],
        targetPositionsTop = [],
        targetPositionsLeft = [],
        myCube,
        ground,
        topGroup = new THREE.Group(),
        leftGroup = new THREE.Group(),
        rightGroup = new THREE.Group(),
        canClick = true,
        menuIsShow = false,
        nowPos= new THREE.Vector3(),
        topMenus = [
            //1
            0xffffff,
            'images/industry01.jpg',
            0xffffff,
            //2
            0x32b16c,
            'images/industry02.jpg',
            0x32b16c,
            //3
            0x89c997,
            'images/industry03.jpg',
            0x89c997,
            //6
            0xb5e0ab,
            'images/industry06.jpg',
            0xb5e0ab,
            //9
            0xffffff,
            'images/industry09.jpg',
            0xffffff,
            //8
            0xb5e0ab,
            'images/industry08.jpg',
            0xb5e0ab,
            //7
            0x70b981,
            'images/industry07.jpg',
            0x70b981,
            //4
            0xb5e0ab,
            'images/industry04.jpg',
            0xb5e0ab,
            //5
            0x5e988c,
            'images/industry05.jpg',
            0x5e988c
        ],
        leftMenus = [
            //1
            0xdfccc8,
            'images/industryB01.jpg',
            0xdfccc8,
            //2
            0xd8472a,
            'images/industryB02.jpg',
            0xd8472a,
            //3
            0xffaa91,
            'images/industryB03.jpg',
            0xffaa91,
            //4
            0xf77b55,
            'images/industryB04.jpg',
            0xf77b55,
            //7
            0xd8472a,
            'images/industryB07.jpg',
            0xd8472a,
            //11
            0xf26762,
            'images/industryB11.jpg',
            0xf26762,
            //10
            0xdfccc8,
            'images/industryB10.jpg',
            0xdfccc8,
            //9
            0xffaa91,
            'images/industryB09.jpg',
            0xffaa91,
            //8
            0xe84c3d,
            'images/industryB08.jpg',
            0xe84c3d,
            //5
            0xffaa91,
            'images/industryB05.jpg',
            0xffaa91,
            //6
            0xffffff,
            'images/industryB06.jpg',
            0xffffff
           
        ],
        rightMenus = [
            //1
            0x3fa8c5,
            'images/industryC01.jpg',
            0x3fa8c5,
            //2
            0x276691,
            'images/industryC02.jpg',
            0x276691,
            //3
            0x19b5db,
            'images/industryC03.jpg',
            0x19b5db,
            //6
            0x266590,
            'images/industryC06.jpg',
            0x266590,
            //9
            0x074f68,
            'images/industryC09.jpg',
            0x074f68,
            //8
            0x03386e,
            'images/industryC08.jpg',
            0x03386e,
            //7
            0x0a6d8d,
            'images/industryC07.jpg',
            0x0a6d8d,
            //4
            0x054d66,
            'images/industryC04.jpg',
            0x054d66,
            //5
            0x0a4e7d,
            'images/industryC05.jpg',
            0x0a4e7d
        ],
        beginCameraPos = new THREE.Vector3(),
        nowObj,
        nowIndex,
        infos =[
        [
            {
                'outTitle':'',
                'content':''
            },
            {
                'outTitle':'国家级重点实验室',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'国家国际科技合作基地',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'省级工程技术研究中心',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'市引进国内外高端研发机构',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'市级工程技术研究中心',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'省级软件技术中心',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'省级重点实验室',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            }
        ],
        [
            {
                'outTitle':'逯利军',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'宋梁',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'吴斌',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'雷欣',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'徐忠建',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'万春',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'江厚炎',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'王捷',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'向华东',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'刘德允',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            }
        ],
        [
            {
                'outTitle':'',
                'content':''
            },
            {
                'outTitle':'',
                'content':''
            },
            {
                'outTitle':'创新平台',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'',
                'content':''
            },
            {
                'outTitle':'',
                'content':''
            },
            {
                'outTitle':'孵化器',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            },
            {
                'outTitle':'',
                'content':''
            },
            {
                'outTitle':'众创空间',
                'content':[
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                    {
                        'title':'精准医疗百家汇',
                        'picUrl':'images/10101.jpg',
                        'info':'这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！这是内容部分！'
                    },
                ]
            }
        ],
    ];


    $('.industryABtn').on('click',function () {
        $('.firstPage').hide();
        myAnimate (myCube,0,ground,targetPositionsTop,topObjects,0);
        nowIndex=0;
    });
    $('.industryBBtn').on('click',function () {
        $('.firstPage').hide();
        myAnimate (myCube,1,ground,targetPositionsLeft,leftObjects,0);
        nowIndex=1;
    });
    $('.industryCBtn').on('click',function () {
        $('.firstPage').hide();
        myAnimate (myCube,2,ground,targetPositions,rightObjects,-Math.PI/2);
        nowIndex=2;

    });

    $('.close').on('click',function () {
        canClick = false;
        $('.info').hide();
        if(nowIndex==0){
            backBoxPos(nowObj,targetPositionsTop);
        }else if(nowIndex==1){
            backBoxPos(nowObj,targetPositionsLeft);
        }else {
            backBoxPos(nowObj,targetPositions);
        }
    });
    function backBoxPos(obj,tPos) {
        new TWEEN.Tween(obj.position)
            .to({
                x: tPos[obj.name].x,
                y: tPos[obj.name].y,
                z: tPos[obj.name].z
            },1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start().onComplete(function () {
            obj.isShow=false;
            canClick = true;
            menuIsShow = false;
        });
        if(nowIndex==0){
            new TWEEN.Tween(obj.rotation)
                .to({
                    x: -Math.PI/2,
                    y: 0,
                    z: 0
                }, 1000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        }else {
            new TWEEN.Tween(obj.rotation)
                .to({
                    x: 0,
                    y: 0,
                    z: 0
                }, 1000)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        }

    }

    function myAnimate (firstObj,indexNow,secondObj,targets,objs,angle) {
        canClick = false;

        new TWEEN.Tween(camera)
            .to({fov:50}, 1000 )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start().onUpdate(function () {
            camera.updateProjectionMatrix();
        }).onComplete(function () {
                if(indexNow==0){
                    new TWEEN.Tween(camera.position)
                        .to({x:0,y:cameraR,z:0}, 1000 )
                        .easing( TWEEN.Easing.Exponential.InOut )
                        .start();

                }else {
                    new TWEEN.Tween(camera.position)
                        .to({x:nowPos.x,y:nowPos.y,z:nowPos.z}, 1000 )
                        .easing( TWEEN.Easing.Exponential.InOut )
                        .start();
                }

                new TWEEN.Tween(firstObj.rotation)
                    .to({x:0,y:angle,z:0}, 1000 )
                    .easing( TWEEN.Easing.Exponential.InOut )
                    .start().onUpdate(function () {
                }).onComplete(function () {
                    setTimeout(function () {
                        new TWEEN.Tween(secondObj.material)
                            .to({opacity:0}, 1000 )
                            .easing( TWEEN.Easing.Exponential.InOut )
                            .start().onUpdate(function () {
                        }).onComplete(function () {
                            ground.visible = false;
                        });
                        transform(targets,1000, objs);
                    },500);
                });
            }
        );
        setTimeout(function () {
            canClick = true;
        },4500);
    }
    function initContent(arr) {
        $('.info .title').text(arr.outTitle);
        if(mySwiper.slides.length>=0){
            mySwiper.removeAllSlides();
        }
        var str='';
        for(var i = 0 ; i < arr.content.length ; i++){
            str+='<div class="swiper-slide contentWrap"><div class="pic"><img src="'+arr.content[i].picUrl+'"></div><div class="content"> <h4>'+arr.content[i].title+'</h4><div class="infoContainer"><p>'+arr.content[i].info+'</p></div></div></div>'
        }
        mySwiper.appendSlide(str);
    }
    init();
    animate();
    function init() {
        container = document.getElementById('webGL');
        camera = new THREE.PerspectiveCamera(cameraFov, webGLW / webGLH, 3, 30000);
        lat = Math.max( -89, Math.min( 89, lat ) );
        phi = THREE.Math.degToRad( 90 - lat );
        theta = THREE.Math.degToRad( lon );
        camera.position.x = cameraR * Math.sin( phi ) * Math.cos( theta );
        camera.position.y = cameraR * Math.cos( phi );
        camera.position.z = -cameraR * Math.sin( phi ) * Math.sin( theta );
        beginCameraPos = camera.position.clone();
        camera.lookAt(target);
        scene = new THREE.Scene();

        nowPos.x = cameraR * Math.sin( Math.PI/2 ) * Math.cos( -Math.PI/2 );
        nowPos.y = cameraR * Math.cos( Math.PI/2 );
        nowPos.z = -cameraR * Math.sin(Math.PI/2 ) * Math.sin( -Math.PI/2 );

        scene.add( topGroup );
        scene.add( leftGroup );
        scene.add( rightGroup );
        var ambientLight = new THREE.AmbientLight( 0xffffff,0.8);
        scene.add( ambientLight );

        var dirLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( -200, 1500, 500);
        scene.add( dirLight );

        dirLight.castShadow = true;

        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;

        var d = 2000;

        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;

        dirLight.shadow.camera.far = 5000;
        dirLight.shadow.bias = -0.0001;

        materials.push(new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load('images/industryA_box.jpg')}));
        materials.push(new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load('images/industryB_box.jpg')}));
        materials.push(new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load('images/industryC_box.jpg')}));
        materials.push(new THREE.MeshPhongMaterial({color:0x89c997}));
        var cubeGeometry = new THREE.CubeGeometry(1000,1000,1000);
        for ( var i = 0, l = cubeGeometry.faces.length; i < l; i ++ ) {

            var face = cubeGeometry.faces[ i ];
            face.materialIndex = 2;

        }
        cubeGeometry.faces[4].materialIndex=0;
        cubeGeometry.faces[5].materialIndex=0;
        cubeGeometry.faces[8].materialIndex=1;
        cubeGeometry.faces[9].materialIndex=1;
        cubeGeometry.sortFacesByMaterialIndex();

        myCube = new THREE.Mesh(cubeGeometry,materials);
//                cube.receiveShadow = true;
        myCube.rotation.y = -Math.PI/4;
        myCube.castShadow = true;
        scene.add( myCube );

        console.log(myCube);
        for(var i = 0 ; i <topMenus.length;i++){
            if(topMenus[i].length>10){
                materials00.push(new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load(topMenus[i])}));
            }else {
                materials00.push(new THREE.MeshPhongMaterial({color:topMenus[i]}));
            }
        }
        for(var i = 0 ; i <leftMenus.length;i++){
            if(leftMenus[i].length>10){
                materials01.push(new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load(leftMenus[i])}));
            }else {
                materials01.push(new THREE.MeshPhongMaterial({color:leftMenus[i]}));
            }
        }
        for(var i = 0 ; i <rightMenus.length;i++){
            if(rightMenus[i].length>10){
                materials02.push(new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load(rightMenus[i])}));
            }else {
                materials02.push(new THREE.MeshPhongMaterial({color:rightMenus[i]}));
            }
        }
        for(var i = 0 ; i <27;i+=3){
            var cubeGeometry = new THREE.CubeGeometry(144,64,10);
            var num = i ;
            for(var j = 0 ; j <cubeGeometry.faces.length;j++ ){
                var face = cubeGeometry.faces[ j ];
                if(j==8||j==9){
                    face.materialIndex = num+1;
                }else if(j==10||j==11){
                    face.materialIndex = num+2;
                }else {
                    face.materialIndex = num;
                }

            }
            cubeGeometry.sortFacesByMaterialIndex();
            var cube = new THREE.Mesh(cubeGeometry,materials00);
            cube.name =Math.floor(i/3);
            cube.rotation.x=-Math.PI/2;
            cube.isShow = false;
            topGroup.add( cube );
            topObjects.push(cube);
        }
        for(var i = 0 ; i <33;i+=3){
            if(i==30){
                var cubeGeometry = new THREE.CubeGeometry(216,64,10);
            }else {
                var cubeGeometry = new THREE.CubeGeometry(108,64,10);
            }

            var num = i ;
            for(var j = 0 ; j <cubeGeometry.faces.length;j++ ){
                var face = cubeGeometry.faces[ j ];
                if(j==8||j==9){
                    face.materialIndex = num+1;
                }else if(j==10||j==11){
                    face.materialIndex = num+2;
                }else {
                    face.materialIndex = num;
                }

            }
            cubeGeometry.sortFacesByMaterialIndex();
            var cube = new THREE.Mesh(cubeGeometry,materials01);
            cube.name =Math.floor(i/3);
            cube.isShow = false;
            leftGroup.add( cube );
            leftObjects.push(cube);
        }
        for(var i = 0 ; i <27;i+=3){
            var cubeGeometry = new THREE.CubeGeometry(144,64,10);
            var num = i ;
            for(var j = 0 ; j <cubeGeometry.faces.length;j++ ){
                var face = cubeGeometry.faces[ j ];
                if(j==8||j==9){
                    face.materialIndex = num+1;
                }else if(j==10||j==11){
                    face.materialIndex = num+2;
                }else {
                    face.materialIndex = num;
                }

            }
            cubeGeometry.sortFacesByMaterialIndex();
            var cube = new THREE.Mesh(cubeGeometry,materials02);
            cube.name =Math.floor(i/3);
            cube.isShow = false;
            rightGroup.add( cube );
            rightObjects.push(cube);
        }
        for(var i = 0 ; i < 11 ; i ++){
            if(i<=3){
                targetPositionsLeft.push(new THREE.Vector3(
                    1080*(i%4-2)+540,
                    640,
                    2900
                ));
            }else if(i<=5){
                targetPositionsLeft.push(new THREE.Vector3(
                    1620,
                    640*(4-i),
                    2900
                ));
            }else if(i<=8){
                targetPositionsLeft.push(new THREE.Vector3(
                    1080*(6-i)+540,
                    -640,
                    2900
                ));
            }else if(i ==9){
                targetPositionsLeft.push(new THREE.Vector3(
                    -1620,
                    0,
                    2900
                ));
            }else {
                targetPositionsLeft.push(new THREE.Vector3(
                    0,
                    0,
                    2900
                ));
            }
        }



        for(var i = 0 ; i < 9 ; i ++){
            if(i<=2){
                targetPositions.push(new THREE.Vector3(
                    1440*(i%3-1),
                    640,
                    2900
                ));
            }else if(i<=4){
                targetPositions.push(new THREE.Vector3(
                    1440,
                    640*(3-i),
                    2900
                ));
            }else if(i<=6){
                targetPositions.push(new THREE.Vector3(
                    1440*(5-i),
                    -640,
                    2900
                ));
            }else{
                targetPositions.push(new THREE.Vector3(
                    1440*(i-8),
                    0,
                    2900
                ));
            }
        }
        for(var i = 0 ; i < 9 ; i ++){
            if(i<=2){
                targetPositionsTop.push(new THREE.Vector3(
                    1440*(i%3-1),
                    2900,
                    -640
                ));
            }else if(i<=4){
                targetPositionsTop.push(new THREE.Vector3(
                    1440,
                    2900,
                    640*(i-3)
                ));
            }else if(i<=6){
                targetPositionsTop.push(new THREE.Vector3(
                    1440*(5-i),
                    2900,
                    640
                ));
            }else{
                targetPositionsTop.push(new THREE.Vector3(
                    1440*(i-8),
                    2900,
                    0
                ));
            }
        }

        //地面

        var groundGeo = new THREE.CircleBufferGeometry( 6000, 64 );
        var groundMat = new THREE.MeshPhongMaterial( { color: 0xaaaaaa,transparent:true } );

        ground = new THREE.Mesh( groundGeo, groundMat );


        ground.rotation.x = -Math.PI/2;
        ground.position.y = -500;

        ground.receiveShadow = true;

        scene.add( ground );
        projector = new THREE.Projector();

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.renderReverseSided = false;
        renderer.setPixelRatio( window.devicePixelRatio*0.5);
        renderer.setSize(webGLW, webGLH);

        container.appendChild(renderer.domElement);

        container.addEventListener( 'mousedown', onDocumentMouseDown, false );
        container.addEventListener( 'mousemove', onDocumentMouseMove, false );
        container.addEventListener( 'mouseup', onDocumentMouseUp, false );
        window.addEventListener('resize', onWindowResize, false);

    }
    function getCameraPos() {
        var vector3 = new THREE.Vector3();
        lat = Math.max( -89, Math.min( 89, lat ) );
        phi = THREE.Math.degToRad( 90 - lat );
        theta = THREE.Math.degToRad( lon );
        vector3.x = cameraR * Math.sin( phi ) * Math.cos( theta );
        vector3.y = cameraR * Math.cos( phi );
        vector3.z = -cameraR * Math.sin( phi ) * Math.sin( theta );
        return vector3;
    }



    function transform(targets, duration, myobjects) {

//                TWEEN.removeAll();
        for (var i = 0; i < myobjects.length; i++) {

            var object = myobjects[i];
            var target = targets[i];

            new TWEEN.Tween(object.position)
                .to({
                    x: target.x,
                    y: target.y,
                    z: target.z
                }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(object.scale)
                .to({
                    x: 10,
                    y: 10,
                    z: 10
                }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

        }

    }

    function reverseTransform(duration, myobjects) {

        TWEEN.removeAll();
        for (var i = 0; i < myobjects.length; i++) {

            var object = myobjects[i];

            new TWEEN.Tween(object.position)
                .to({
                    x: 0,
                    y: 0,
                    z: 0
                }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(object.scale)
                .to({
                    x: 1,
                    y: 1,
                    z: 1
                }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

        }

    }

    function onDocumentMouseDown( event ) {
        event.preventDefault();
        isUserInteracting = true;
        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;
        onPointerDownLon = lon;
        onPointerDownLat = lat;
        isMoving=false;
    }

    function onDocumentMouseMove( event ) {

        if ( isUserInteracting === true ) {
            isMoving=true;
            lon = ( onPointerDownPointerX - event.clientX ) * 0.2 + onPointerDownLon;
            lat = ( event.clientY - onPointerDownPointerY ) * 0.2 + onPointerDownLat;
            lat = Math.max( -89, Math.min( 89, lat ) );
            phi = THREE.Math.degToRad( 90 - lat );
            theta = THREE.Math.degToRad( lon );
            camera.position.x = cameraR * Math.sin( phi ) * Math.cos( theta );
            camera.position.y = cameraR * Math.cos( phi );
            camera.position.z = -cameraR * Math.sin( phi ) * Math.sin( theta );
//                    console.log(lon,lat);
        }
    }

    function onDocumentMouseUp( event ) {
        isUserInteracting = false;
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );
        var intersectsTop = raycaster.intersectObjects(topGroup.children);
        if(intersectsTop.length>0&&!isMoving&&canClick){
            canClick = false;
            if(intersectsTop[0].object.name!=8){
                tansformCube(intersectsTop[0].object,targetPositionsTop,0);
                setTimeout(function () {

                    $('.info').show();
                    initContent(infos[nowIndex][intersectsTop[0].object.name]);
                },1000);
                nowObj = intersectsTop[0].object;
            }else {
                reverseTransform(1000,topObjects);
                ground.visible = true;
                new TWEEN.Tween(ground.material)
                    .to({opacity:1}, 1000 )
                    .easing( TWEEN.Easing.Exponential.InOut )
                    .start().onUpdate(function () {
                }).onComplete(function () {
                });
                setTimeout(function () {
                    new TWEEN.Tween(myCube.rotation)
                        .to({x:0,y:-Math.PI/4,z:0}, 1000 )
                        .easing( TWEEN.Easing.Exponential.InOut )
                        .start().onUpdate(function () {
                    }).onComplete(function () {
                        new TWEEN.Tween(camera)
                            .to({fov:5}, 1000 )
                            .easing( TWEEN.Easing.Exponential.InOut )
                            .start().onUpdate(function () {
                            camera.updateProjectionMatrix();
                        }).onComplete(function () {
                            $('.firstPage').show();
                            canClick = true;
                        });
                    });
                    new TWEEN.Tween(camera.position)
                        .to({x:beginCameraPos.x,y:beginCameraPos.y,z:beginCameraPos.z}, 1000 )
                        .easing( TWEEN.Easing.Exponential.InOut )
                        .start();
                },2000);
            }
        }


        var intersectsLeft = raycaster.intersectObjects(leftGroup.children);
        if(intersectsLeft.length>0&&!isMoving&&canClick){
            if(intersectsLeft[0].object.name!=10){
                tansformCube(intersectsLeft[0].object,targetPositionsLeft,1);
                setTimeout(function () {

                    $('.info').show();
                    initContent(infos[nowIndex][intersectsLeft[0].object.name]);
                },1000);
                nowObj = intersectsLeft[0].object;
            }else {
                reverseTransform(1000,leftObjects);
                ground.visible = true;
                new TWEEN.Tween(ground.material)
                    .to({opacity:1}, 1000 )
                    .easing( TWEEN.Easing.Exponential.InOut )
                    .start().onUpdate(function () {
                }).onComplete(function () {
                });
                setTimeout(function () {
                    new TWEEN.Tween(myCube.rotation)
                        .to({x:0,y:-Math.PI/4,z:0}, 1000 )
                        .easing( TWEEN.Easing.Exponential.InOut )
                        .start().onUpdate(function () {
                    }).onComplete(function () {
                        new TWEEN.Tween(camera)
                            .to({fov:5}, 1000 )
                            .easing( TWEEN.Easing.Exponential.InOut )
                            .start().onUpdate(function () {
                            camera.updateProjectionMatrix();
                        }).onComplete(function () {
                            $('.firstPage').show();
                            canClick = true;
                        });
                    });
                    new TWEEN.Tween(camera.position)
                        .to({x:beginCameraPos.x,y:beginCameraPos.y,z:beginCameraPos.z}, 1000 )
                        .easing( TWEEN.Easing.Exponential.InOut )
                        .start();
                },2000);
            }
        }

        var intersectsRight = raycaster.intersectObjects(rightGroup.children);
        if(intersectsRight.length>0&&!isMoving&&canClick){
            if(intersectsRight[0].object.name!=8){
                tansformCube(intersectsRight[0].object,targetPositions,2);
                setTimeout(function () {

                    $('.info').show();
                    initContent(infos[nowIndex][intersectsRight[0].object.name]);
                },1000);
                nowObj = intersectsRight[0].object;
            }else {
                reverseTransform(1000,rightObjects);
                ground.visible = true;
                new TWEEN.Tween(ground.material)
                    .to({opacity:1}, 1000 )
                    .easing( TWEEN.Easing.Exponential.InOut )
                    .start().onUpdate(function () {
                }).onComplete(function () {
                });
                setTimeout(function () {
                    new TWEEN.Tween(myCube.rotation)
                        .to({x:0,y:-Math.PI/4,z:0}, 1000 )
                        .easing( TWEEN.Easing.Exponential.InOut )
                        .start().onUpdate(function () {
                    }).onComplete(function () {
                        new TWEEN.Tween(camera)
                            .to({fov:5}, 1000 )
                            .easing( TWEEN.Easing.Exponential.InOut )
                            .start().onUpdate(function () {
                            camera.updateProjectionMatrix();
                        }).onComplete(function () {
                            $('.firstPage').show();
                            canClick = true;
                        });
                    });
                    new TWEEN.Tween(camera.position)
                        .to({x:beginCameraPos.x,y:beginCameraPos.y,z:beginCameraPos.z}, 1000 )
                        .easing( TWEEN.Easing.Exponential.InOut )
                        .start();
                },2000);
            }
        }
        isMoving=false;
    }
    function tansformCube(obj,tPos,nowIndex) {
        canClick = false;
        TWEEN.removeAll();
        if(!obj.isShow&&!menuIsShow){
            if(nowIndex==0){
                new TWEEN.Tween(obj.position)
                    .to({
                        x: 0,
                        y: 4200,
                        z: 0
                    },1000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start().onComplete(function () {
                    obj.isShow=true;
                    canClick = true;
                    menuIsShow = true;
                });
                new TWEEN.Tween(obj.rotation)
                    .to({
                        x:-Math.PI/2,
                        y: Math.PI,
                        z:0
                    }, 1000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }else {
                new TWEEN.Tween(obj.position)
                    .to({
                        x: 0,
                        y: 0,
                        z: 4200
                    },1000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start().onComplete(function () {
                    obj.isShow=true;
                    canClick = true;
                    menuIsShow = true;
                });
                new TWEEN.Tween(obj.rotation)
                    .to({
                        x: 0,
                        y: Math.PI,
                        z: 0
                    }, 1000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }

        }
//                else if(menuIsShow&&obj.isShow){
//                    new TWEEN.Tween(obj.position)
//                            .to({
//                                x: tPos[obj.name].x,
//                                y: tPos[obj.name].y,
//                                z: tPos[obj.name].z
//                            },1000)
//                            .easing(TWEEN.Easing.Exponential.InOut)
//                            .start().onComplete(function () {
//                        obj.isShow=false;
//                        canClick = true;
//                        menuIsShow = false;
//                    });
//                    new TWEEN.Tween(obj.rotation)
//                            .to({
//                                x: 0,
//                                y: 0,
//                                z: 0
//                            }, 1000)
//                            .easing(TWEEN.Easing.Exponential.InOut)
//                            .start();
//                }
        else {
            canClick = true;
        }

    }


    function onWindowResize() {
        webGLW = $('#webGL').width();
        webGLH = $('#webGL').height();
        camera.aspect = webGLW / webGLH;
        camera.updateProjectionMatrix();
        renderer.setSize(webGLW, webGLH);
    }

    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
        render();
    }


    function render() {
        camera.lookAt(target);
        renderer.render( scene, camera );
    }
};