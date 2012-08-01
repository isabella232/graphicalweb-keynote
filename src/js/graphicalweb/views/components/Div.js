define(['graphicalweb/utils/CSS3Helper'],

	function (CSS3Helper) {
		
		var Div = function () {
			var instance = this,
                element,
                interval,
                width = 80,
                num_columns = 10,
                num_frames,
                row, 
                col,
                currframe = 0,
                nextmap = 0,
                currmap = 0,
                state = '',
                anim_map = [
                    {name: 'idle1', min: 0, max: 20},
                    {name: 'talk', min: 21, max: 37},
                    {name: '', min: 25, max: 30},
                    {name: '', min: 31, max: 40}
                ],
                idle_maps = [0],
                translateString,
                rotateString;

            instance.looping = false;
            instance.position = {x: 0, y: 0, z: 0};
            instance.rotation = {x: 0, y: 0, z: 0};

//private
            function update() {
                translateString = 'translate3d(' + instance.position.x + 'px, ' + instance.position.y + 'px, ' + instance.position.z + 'px)';
                rotateString = 'rotateX(' + instance.rotation.x + 'deg) rotateY(' + instance.rotation.y + 'deg) rotateZ(' + instance.rotation.z + 'deg)';
                CSS3Helper.setTransform(element[0], translateString + rotateString);             //translation uses scene
            }

            function spriteUpdate() {
                var randomidle;

                currframe += 1;

                if (currframe == anim_map[currmap].max) {
                    
                    if (currmap !== nextmap && nextmap !== 0) {
                        currmap = nextmap;
                    } else if (instance.looping !== true) {
                        nextmap = 0;
                        randomidle = Math.floor(Math.random() * idle_maps.length);
                        currmap = idle_maps[randomidle];
                    } 

                    currframe = anim_map[currmap].min;
                } 

                row = Math.floor(currframe / 10);
                col = currframe % 10;
                
                element.css({backgroundPosition: (-col * width) + 'px ' + (-row * width) + 'px'});
            }
            
//public

			instance.init = function () {
                element = $('#charDIV');
                instance.start();
            };

            instance.start = function () {
                interval = setInterval(spriteUpdate, 50);
            };

            instance.stop = function () {
                clearInterval(interval);
            };

            //SETTERS

            instance.setFace = function (personality) {
                var i = 0;
                
                state = personality;
                instance.looping = state == 'talk' ? true : false;

                if (state === '') {
                    nextmap = 0;
                } else {

                    for (i; i < anim_map.length; i += 1) {
                        if (anim_map[i].name == state) {
                            nextmap = i;
                        }
                    }
                }
            }

            instance.setPosition = function (newPosition) {
                instance.position = newPosition;
                update();
            };

            instance.setRotation = function (newRotation) {
                instance.rotation = newRotation;
                update();
            };

            //ANIMATION
            instance.animate = function (start, end, duration, params) {

                if (typeof(params) !== 'undefined') {
                    params.delay = typeof(params.delay) == 'undefined' ? 0 : params.delay;
                    params.easing = typeof(params.easing) == 'undefined' ? TWEEN.Easing.Linear.EaseNone : params.easing;
                } else {
                    params = {};
                    params.delay = 0;
                    params.easing = TWEEN.Easing.Linear.EaseNone;
                }

                new TWEEN.Tween(start)
                    .to(end, duration)
                    .delay(params.delay)
                    .easing(params.easing)
                    .onUpdate(function () {
                        update();
                    })
                    .onComplete(function () {
                        if (typeof(params.callback) == 'function') {
                            params.callback();
                        }
                    })
                    .start();
            };

            instance.animatePosition = function (goalPosition, duration, params) {
                instance.animate(instance.position, goalPosition, duration, params);
            };

            instance.animateRotation = function (goalRotation, duration, params) {
                instance.animate(instance.rotation, goalRotation, duration, params);
            };

            instance.init();
		};

		return new Div();
    });
