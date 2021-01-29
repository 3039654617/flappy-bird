

let bird = {
    startStatus: '小',   //开始挑战字体初始为小号
    position: 200,       //鸟儿的蹦跶时的位置
    clock: true,
    dropSpeed: 200,
    dropAccelerated: 0,
    skyStep: 2,
    skyPosition: 0,
    pipeNum: 7,
    pipeWrap:[],
    score: 0,
    lastPipeIndex: 6,
    


    init: function(){
        let self = this;
        let timing = 0;
        let timing1 = 0;
        this.getDom();
        this.start();
        this.gameAgain();
        this.scoreArr = this.getScore();

        this.timer = setInterval(function(){
            ++timing;

            
            if(timing % 15 ===0){
                if(self.clock){
                    self.birdTop();
                    self.blink();
                }
            }

            if(timing % 5 ===0){
                ++timing1;
                self.birdFly(timing1);
            }    
            if(!self.clock){
                self.birdDrop();
                self.pipeMove();
                self.addScore();
                self.crash(self.score);
            }

            self.skyMove();
            self.gameOver();
        },30);

        
    },

    getDom: function(){
        this.oWrap = document.getElementsByClassName('wrap')[0];
        this.oBird = document.getElementsByClassName('bird')[0];
        this.oStart = document.getElementsByClassName('start')[0];
        this.oFlappy = document.getElementsByClassName('flappy-bird')[0];
        this.oRunScore = document.getElementsByClassName('run-score')[0];
        this.oEnd = document.getElementsByClassName('end')[0];
        this.oAgain = document.getElementsByClassName('again')[0];
        this.oEndScore = document.getElementsByClassName('end-score')[0];
        this.oScoreList = document.getElementsByClassName('score-list')[0];
    },

    createDom: function(left){
        let upPipeH = 50 + Math.floor(Math.random()*175);
        let downPipeH = 450 - upPipeH;
        let oUpPipe = createDom('div', ['pipe', 'pipe-up'], {height: upPipeH + 'px', left: left + 'px'});
        let oDownPipe = createDom('div', ['pipe', 'pipe-down'], {height: downPipeH + 'px', left: left + 'px'})
        this.oFlappy.append(oUpPipe);
        this.oFlappy.append(oDownPipe);

        this.pipeWrap.push({
            up: oUpPipe, 
            down: oDownPipe,
            height: [upPipeH, upPipeH + 120]   //150的间隙减去鸟儿的高30
        });
    },

    gameAgain: function(){
        let self = this;
        this.oAgain.onclick = function(){
            self.oEnd.style.display = 'none';
            self.oRunScore.style.display = 'none';
            self.oStart.style.display = 'block';
        }
    },

    gameOver: function(){
        if(parseInt(this.oWrap.style.top) > 570 || parseInt(this.oWrap.style.top) < 0){
            clearInterval(this.timer);
            this.oRunScore.style.display = 'none';
            this.oEnd.style.display = 'block';
            this.setScore();
            for(let i = 0; i < this.oPipe.length; i++){
                this.oPipe[i].style.display = 'none';
            }
            this.renderList();
            this.oAgain.onclick = function(){
                window.location.reload();
            }
        }
    },

    skyMove: function(){
        this.skyPosition -= this.skyStep;
        this.oFlappy.style.backgroundPositionX = this.skyPosition + 'px';
    },

    birdDrop: function(){
        this.dropSpeed += ++ this.dropAccelerated;
        this.oWrap.style.top = this.dropSpeed + 'px';
    },

    start: function(){
        let self = this;

        this.oStart.onclick = function(){
            self.oStart.style.display = 'none';
            self.oWrap.style.left = '30px';
            self.clock = false;
            self.skyStep = 5;
            self.oRunScore.style.display = 'block';
            for(let i = 0; i < self.pipeNum; i++){
                self.createDom(600 + 300*(i + 1));
            }
        }
        this.oFlappy.onclick = function(){
            self.dropAccelerated = -10;
        }
    },

    setScore: function(){
        this.scoreArr.push({
            score: this.score,
            time: this.getDate(),
        })
        this.scoreArr.sort(function (a, b) {
            return b.score - a.score;
        })

        setLocal('score', this.scoreArr);
    },

    getScore: function(){
        let scoreArr = getLocal('score');
        return scoreArr;
    },

    renderList: function(){
        let template = '';
        for(let i =0; i < 8; i++){
            template += `
                <li>
                    <span>${i+1}</span>
                    <span>${this.scoreArr[i].score}</span>
                    <span>${this.scoreArr[i].time}</span>
                </li>
            `
        }
        this.oScoreList.innerHTML = template;

    },

    formatTime: function(time){
        if(time < 10){
            time = '0' + time;
        }
        return time;
    },

    getDate: function(){
        let date = new Date();
        let year = date.getFullYear();
        let month = this.formatTime(date.getMonth() + 1);
        let day = this.formatTime(date.getDate());
        let hour = this.formatTime(date.getHours());
        let minute = this.formatTime(date.getMinutes());
        let second = this.formatTime(date.getSeconds());

        return `${year}:${month}:${day}&nbsp&nbsp${hour}:${minute}:${second}`;
    },

    addScore: function(){
        let index = this.score % 7;
        let left = this.pipeWrap[index].up.offsetLeft;

        if(left < -22){
            this.oRunScore.innerText = ++ this.score;
        }
    },

    crash: function(index){
        this.oPipe = document.getElementsByClassName('pipe');
        index = index % 7;
        let pipeX = this.pipeWrap[index].up.offsetLeft;
        let upPipeY = this.pipeWrap[index].height[0];
        let downPipeY = this.pipeWrap[index].height[1];
        let birdTop = this.oWrap.offsetTop;

        if((pipeX < 60 && pipeX > -22) && (birdTop < upPipeY || birdTop > downPipeY)){
            clearInterval(this.timer);
            this.oRunScore.style.display = 'none';
            this.oEnd.style.display = 'block';
            for(let i = 0; i < this.oPipe.length; i++){
                this.oPipe[i].style.display = 'none';
            }
            this.setScore();
            this.oEndScore.innerText = this.score;
            this.getScore();
            this.renderList();
            this.oAgain.onclick = function(){
                window.location.reload();
            }
        }
    },

    pipeMove: function(){
        for(let i = 0; i < this.pipeWrap.length; i++){
            let oUpPipe = this.pipeWrap[i].up;
            let oDownPipe = this.pipeWrap[i].down;
            let left = oUpPipe.offsetLeft - this.skyStep;

            if(left < -52){
                let lastLeft = this.pipeWrap[this.lastPipeIndex].up.offsetLeft;
                oUpPipe.style.left = lastLeft + 300 + 'px';
                oDownPipe.style.left = lastLeft + 300 + 'px';
                this.lastPipeIndex = ++ this.lastPipeIndex % this.pipeNum;
            }else{
                oUpPipe.style.left = left + 'px';
                oDownPipe.style.left = left + 'px';
            }
        }
    },

    birdTop: function(){
        this.position = this.position === 200 ? 220 : 200;
        this.oWrap.style.top = this.position + 'px';
    },

    birdFly: function(num){
        this.oBird.style.backgroundPositionX = (num % 3) * -30 + 'px';
    },
    blink: function(){
        if(this.startStatus === '小'){
            this.oStart.classList.add('start-hotpink'); 
            this.startStatus = '大'; 
        }else{
            this.oStart.classList.remove('start-hotpink');  
            this.startStatus = '小';
        }
    }
}

bird.init();