
//ensemble des fenetres
var windowElements = document.querySelectorAll(".windows .win");
//ensemble des icones
var icons = document.querySelectorAll(".windows .icon")

const windowList = [];

//memorisation des fenetres
var pdfTab=null;
var txtTab=null;
var imgTab=null;

//z-index pour placer les objets au plus haut
window.maxZIndex = 0;

//classe window
class Window {
    constructor(el, initX, initY,off) {
        console.log('new')
        this.el = el;
        let height = 300;
        let width = 300;
        this.el.style.zIndex = window.maxZIndex++;
        this.isGrabbed = false;
        this.isReduced = false;
        this.isInit = false;

        this.grabOffset = { x: 0, y: 0 };

        if (this.el.dataset.width && this.el.dataset.height) {

          width = this.el.dataset.width;
          height = this.el.dataset.height;
          console.log(width,height)
        }
        this.el.style.width = width + "px";
        this.el.style.height = height + "px";
        const rectangle = this.el.getBoundingClientRect();
        if (this.el.dataset.initX && this.el.dataset.initY) {
              this.posX =
                (this.el.dataset.initX / 100) ;
              this.posY =
                (this.el.dataset.initY / 100) ;
            }
        else{
            this.posX = Math.random() ;
            this.posY = Math.random() ;
        }

        this.setWindowPosition();

        //bouton close
        const close=el.querySelector(".off")

        //bouton reduce
        const reduce=el.querySelector(".red")

        //top bar fenetre
        const to_open=el.querySelector("#top")


        close.addEventListener("mousedown", (e) => this.Close(e));



        if (reduce!=null){
        reduce.addEventListener("mouseup", (e) => this.Reduce(e));
        }

        if (to_open!=null){
                to_open.addEventListener("mousedown", (e) => this.Open(e));
                }


        el.addEventListener("mousedown", (e) => this.grabbedWindow(e));
    }

    //fermeture fenetre
    Close(e) {
        console.log('close');

        //test fermeture de la fenetre de depart
        if(this.el.id=='end'){
             location.reload();
        }

        else{
            //suppression de la fenetre
            this.el.remove()
            var windowElements = document.querySelectorAll(".windows .win");

            //test du nombre de fenetres restantes
            //si aucune fenetre => fenetre de depart
            if (windowElements.length==0){

            console.log('well done')
            const doc = document.querySelector(".windows")
            //console.log(doc)
            var newDiv = document.createElement('div');
            console.log(newDiv);
            document.querySelector('.windows').insertBefore(newDiv,document.querySelector(' .icon'));

            newDiv.innerHTML='<div id="top">'
                                  +'<div class="windows-title"><p>end.txt</p></div>'
                                + ' <div class="option">'
                                 +     '<div class="red"> _ </div>'
                               +       '<div class="off"> X </div>'
                               +   '</div>'
                             + '</div>'
                            + ' <div id="cv_all">'
                              +    '<h1>Well done ;)</h1>'
                             + '</div>'
            newDiv.classList.add("win");
            newDiv.setAttribute('data-width', "700");
            newDiv.setAttribute('data-height', "250");
            newDiv.id='end'
            console.log(newDiv.dataset);
            windowList.push(new Window(newDiv));

            //suppression des icones
            document.querySelectorAll('.icon').forEach((icon)=>{
            icon.remove()
            })


            }
        }
    }

    //ouverture fenetre reduced
    Open(e){
        var x=0;
        var y=0;
        if(this.isReduced){
            console.log('open');
            this.isReduced = false;
            this.el.firstElementChild.classList.remove("is-reduced");
            this.el.querySelector(".red").innerHTML='_';
            const rectangle = this.el.getBoundingClientRect();

            //on remet la fenetre a sa place avant reduction
            x=this.posX * (window.innerWidth - rectangle.width);
            y=this.posY* (window.innerHeight - rectangle.height);
            const reduced=document.querySelectorAll(".is-reduced");


            this.el.style.transform = `translate3d(${x}px, ${y }px, 0)`;

        }

    }

    //reduire fenetre
    Reduce(e) {
        var x=0;
        var y=0;

        if(!this.isReduced){
            console.log('reduce');
            const reduced=document.querySelectorAll(".is-reduced");
            this.el.style.transition='transform 230ms ease-in-out'
            this.Move()
            x=30;

            if (reduced.length>0){

                reduced.forEach((win)=>{
                x+=5;
                x+=parseInt(win.parentNode.dataset.width,10)})
                console.log(x)
            }
            this.isReduced = true;
            this.el.firstElementChild.classList.add("is-reduced")
            this.el.querySelector(".red").innerHTML='☐';
            y=window.innerHeight - 42;

            const rectangle = this.el.getBoundingClientRect();
            //this.el.style.transition= 'transform 230ms ease-in-out';
            this.el.style.transform = `translate3d(${x}px, ${y }px, 0)`;


        }

    }


    //gestion des fenetres reduites => affichage dans l'ordre de reduction
    Move(){
        console.log('move')
        var x1=30;

        const reduced=document.querySelectorAll(".is-reduced");
        if (reduced.length>0){
            const redArray=Array.from(reduced)
            //console.log(redArray)
            redArray.sort(function(a, b){
                        return a.parentNode.style.zIndex-b.parentNode.style.zIndex})
            //console.log(redArray)
            redArray.forEach((red)=>{
                //console.log(red.parentNode.style.zIndex)
                //console.log(x1,red.parentNode.offsetWidth);
                red.parentNode.style.transform = `translate3d(${x1}px, ${(window.innerHeight - 42)}px, 0)`;
                x1+=parseInt(red.parentNode.dataset.width,10);
                x1+=5;
            });
        }
    }

    grabbedWindow(e) {
        //console.log(e);
        if (!this.isReduced){
            this.el.style.zIndex = window.maxZIndex++;
            this.isGrabbed = true;
            this.el.classList.add("is-grabbed");

            //computing offset between mouse and card origin
            const rectangle = this.el.getBoundingClientRect();
            this.grabOffset = {
              x: e.clientX - rectangle.x,
              y: e.clientY - rectangle.y
            };
        }
    }

    setWindowPosition() {
        const rectangle = this.el.getBoundingClientRect();

        this.el.style.transform = `translate3d(${this.posX * (window.innerWidth - rectangle.width)}px, ${this.posY* (window.innerHeight - rectangle.height)}px, 0)`;
    }


}


//creation des objets fenetres
windowElements.forEach((el) => {
  windowList.push(new Window(el));
  //memorisation des fenetres
  if(el.id=='pdf'){
        pdfTab=el;
        }
  if(el.id=='txt'){
          txtTab=el;
          }
  if(el.id=='image'){
            imgTab=el;
            }
});

//on enleve l'attribut is-grabbed lorsqu'on lache une fenetre
window.addEventListener("mouseup", () => {
  windowList.forEach((win) => {
    win.isGrabbed = false;
    win.el.classList.remove("is-grabbed");
    win.el.children[0].style.pointerEvents='auto'
    //console.log(win.el.children[0].style)
  });
});


//detection des mouvements de souris
window.addEventListener("mousemove", (e) => {
  windowList.forEach((win) => {
    //console.log(e);

    //console.log(win.el.children[0].style)

    //mis a jour de la position de la fenetre grabbed
    if (win.isGrabbed) {
      win.el.children[0].style.pointerEvents='none';
      win.el.style.transition= '';
      win.el.style.transform = `translate3d(${
              e.clientX - win.grabOffset.x
            }px, ${e.clientY - win.grabOffset.y}px, 0)`;
      const rect = win.el.getBoundingClientRect();
      win.posX=rect.x/(window.innerWidth - rect.width);
      win.posY=rect.y/(window.innerHeight - rect.height);

    }
  });
});


//mis a jour des position lors du redimmensionnement du navigateur
window.addEventListener("resize", () => {
  windowList.forEach((win) => {
    win.setWindowPosition();
    //console.log(win.posX)
  });
});

//lecture double clicks sur une icone
icons.forEach((ico) => {
    ico.addEventListener("dblclick", () => {

        if(ico.id=='txt'){
            document.querySelector('.windows').insertBefore(txtTab,document.querySelector(' .icon'));
            //document.querySelector('.windows').insertBefore(txtTab,document.querySelector(' .icon'));
            txtTab.style.zIndex = window.maxZIndex++;
        }

        if(ico.id=='image'){
            console.log('open '+ico.id)
            document.querySelector('.windows').insertBefore(imgTab,document.querySelector(' .icon'));
            imgTab.style.zIndex = window.maxZIndex++;
                }

        if(ico.id=='pdf'){
            console.log('open '+ico.id)
            document.querySelector('.windows').insertBefore(pdfTab,document.querySelector(' .icon'));
            pdfTab.style.zIndex = window.maxZIndex++;
        }
        });

});







