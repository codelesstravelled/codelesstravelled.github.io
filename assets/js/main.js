gsap.registerPlugin(MotionPathPlugin);

const svg = document.querySelector('#road-img');

svg.addEventListener('load', () => {
    const svgDoc = svg.contentDocument;
    const car = svgDoc.getElementById("car-fig");
    //const path = svgDoc.getElementById("path8419");
    const path = "m 0,0 c 0,0 0,-8 1,-13 C 3,-20 13,-31 15,-34 c 2,-3 14,-18 18,-23";

    var tl = gsap.timeline({paused:true})
    tl.to(car, {
        duration: 0.8,
        delay: 0,
        motionPath: {
            path: path,
            autoRotate: 90,
            alignOrigin: [0.5, 0.5],
            end: 0.7
        }});

    car.addEventListener("mouseover", function() {
        tl.play();
        console.log("MOUSE OVER");
    });

/*
    gsap.to(car, {
        duration: 0.8,
        delay: 2,
        //rotation: "20_short",
        //rotate: 90,
        motionPath: {
            path: path,
            autoRotate: 90,
            alignOrigin: [0.5, 0.5],
            end: 0.7
        }})

    gsap.to(car, {
        rotate: 180,
        transformOrigin:"center",
        delay: 0
        })
*/
    /*
    gsap.to(car, {
        duration: 5, 
        repeat: 12,
        repeatDelay: 3,
        yoyo: true,
        ease: "power1.inOut",
        motionPath:{
          path: path,
          align: path,
          autoRotate: true,
          alignOrigin: [0.5, 0.5]
        }
      });
    */
    //var tl = gsap.timeline({defaults:{duration: .7, ease: Back.easeOut.config(10), opacity: 0}})
    //tl.from(car, {delay: 1, scale: .2, transformOrigin: 'center'}, "=.2")
});