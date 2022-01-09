const canvas = document.getElementById("header-canvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
//canvas.addEventListener('wheel', evt => evt.preventDefault());

const SPEED = 10;

function addPalmAnimation(scene, palm, offset=0){
    const animPalm = new BABYLON.Animation("palmAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const palmKeys = [];
    
    const initialLocation = 20 + offset;
    const finalLocation = -4;
    const distance = initialLocation - finalLocation;

    palmKeys.push({
        frame: 0,
        value: initialLocation
    });

    const frames = distance * 100 / SPEED;

    palmKeys.push({
        frame: frames,
        value: finalLocation
    });

    animPalm.setKeys(palmKeys);

    palm.animations = [];
    palm.animations.push(animPalm);

    scene.beginAnimation(palm, 0, frames, true);
}

function addGroundAnimations(scene, ground){
    const animGround = new BABYLON.Animation("groundAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const groundKeys = []; 

    const initialLocation = 4;
    const finalLocation = -4;
    const distance = initialLocation - finalLocation;

    groundKeys.push({
        frame: 0,
        value: 4
    });

    const frames = distance * 100 / SPEED;

    groundKeys.push({
        frame: frames,
        value: -4
    });

    animGround.setKeys(groundKeys);

    ground.animations = [];
    ground.animations.push(animGround);

    scene.beginAnimation(ground, 0, frames, true);
}

// Add your code here matching the playground format
const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    // Remove the updates from mouse movement
    scene.skipPointerMovePicking = true;

    // Remove the clear of the scene buffers as there is always geometry on screen
    scene.autoClear = false; // Color buffer
    scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
    
    BABYLON.SceneLoader.ImportMesh("", "/assets/obj/", "OC13_7_5.obj", scene, function (meshes, particleSystems, skeletons) {
        const palm = BABYLON.Mesh.MergeMeshes(meshes, true, allow32BitsIndices=true);
        const scaleSize = 0.4;
        palm.scaling = new BABYLON.Vector3(scaleSize, 1.2*scaleSize, scaleSize);
        palm.position = new BABYLON.Vector3(3, 0, 8);
        palm.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, Math.PI / 2);
        palm.doNotSyncBoundingInfo = true;

        const palmColor = new BABYLON.StandardMaterial("palmColor");
        palmColor.diffuseColor = new BABYLON.Color3.Teal();
        palm.material = palmColor; 
        palmColor.freeze();
        
        const palmInstances = [];

        for (let i = 0; i < 8; i++){
            palmInstances[i] = palm.createInstance("palmInstance");
            palmInstances[i].position = new BABYLON.Vector3(-3, 0, 4);

            palmInstances[i + 1] = palm.createInstance("palmInstance");
            palmInstances[i + 1].position = new BABYLON.Vector3(3, 0, 4);

            addPalmAnimation(scene, palmInstances[i], 4 * i);
            addPalmAnimation(scene, palmInstances[i + 1], 4 * i + 2);
        }   
        
        addPalmAnimation(scene, palm, 9);     
    });
  
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 1.9, 3, new BABYLON.Vector3(0, 1, 0));
    //camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, -1));
    
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:100, height:100});
    const groundGrid = new BABYLON.StandardMaterial("groundGrid");
    groundGrid.diffuseTexture = new BABYLON.Texture("/assets/img/tile.png");
    groundGrid.diffuseTexture.uScale = 100;
    groundGrid.diffuseTexture.vScale = 100;
    ground.material = groundGrid;
    ground.doNotSyncBoundingInfo = true;

    const road = BABYLON.MeshBuilder.CreateBox("road", {width:5, height:0.1, depth: 100});
    const roadMaterial = new BABYLON.StandardMaterial("roadMaterial");
    roadMaterial.diffuseTexture = new BABYLON.Texture("/assets/img/road.png");
    roadMaterial.diffuseTexture.uScale = 1;
    roadMaterial.diffuseTexture.vScale = 1;
    roadMaterial.diffuseTexture.uAng = Math.PI / 2;
    roadMaterial.diffuseTexture.vAng = Math.PI / 2;
    roadMaterial.freeze();
    road.material = roadMaterial;
    road.doNotSyncBoundingInfo = true;

    addGroundAnimations(scene, ground);
    addGroundAnimations(scene, road);

    const background = BABYLON.MeshBuilder.CreateBox("background", {width: 105, height: 26, depth: 1});
    const backgroundTexture = new BABYLON.StandardMaterial("groundGrid");
    backgroundTexture.diffuseTexture = new BABYLON.Texture("/assets/img/background.png");
    background.material = backgroundTexture;

    background.position.z = 15;
    background.position.y = 13;
    background.freezeWorldMatrix();
    background.doNotSyncBoundingInfo = true;
    
    return scene;
};

const scene = createScene(); //Call the createScene function

function showWorldAxis(size) {
    var makeTextPlane = function(text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
        var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
    return plane;
     };
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

//showWorldAxis(1);

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        
    engine.resize();
});

