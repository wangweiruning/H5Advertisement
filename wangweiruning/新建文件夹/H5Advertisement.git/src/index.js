import React from "react";
import ReactDOM from "react-dom";
import { loadImages,getImageUrl } from "../lib/loading";
import jTimeline from "../lib/jTimelineCss";
import { loadFlashImages, Flash } from "../lib/flash";
import { Panel, PanelContext } from "../lib/panel";
import { PanelAnimation } from "../lib/panelAnimation";

// import WeiXinShare from "./WeiXinShare";
/**微信分享*/
// let wxShare = new WeiXinShare();

class PopPage extends React.Component {
    handleCloseLayer = () => {
        goPop("/close");
    };
    render() {
        return <div className="full" ref="root" style={{ background: "rgba(0,0,0,0.93)", zIndex: 100 }}>
            <div style={{ width: "6.43rem", height: "10.06rem" }} className="center">
                <img ref="pop1" src={getImageUrl("pop/1.png")} style={{ left: "0rem", top: "0rerm", width: "6.43rem", height: "10.06rem" }} className="abs" />
                <img ref="pop2" src={getImageUrl("pop/2.png")} onClick={this.handleCloseLayer} style={{ left: "5.25rem", top: "0.08rem", width: "0.51rem", height: "0.51rem", padding: "0.2rem" }} className="abs" />
            </div>
        </div>
    }
}
/**
 * 主页配置
 */
class IndexPage extends React.Component {
    componentDidMount() {
        window.go = (url, trans) => {
            this.refs.root.panel.go(url, trans);
        };
        window.goPop = (url, trans) => {
            this.refs.popPanel.panel.go(url, trans);
        };
    }
    render() {
        return <div className="full">
            <PanelContext ref="root" url="/loading" animation={PanelAnimation.bottom}>
                <div className="full">
                    <Panel url="loading" component={LoadingPage} />
                    <Panel url="s" root={() => this.refs.s} >
                        <div className="full" ref="s">
                            <Panel url="index" component={SosoPage} />
                            <Panel url="select" component={SelectPage} />

                            <Panel url="girl1" component={Girl1Page} />
                            <Panel url="girl2" component={Girl2Page} />
                            <Panel url="girl3" component={Girl3Page} />

                            <Panel url="boys1" component={Boys1Page}/>
                            <Panel url="boys2" component={Boys2Page} />
                            <Panel url="boys3" component={Boys3Page} />

                            <Panel url="loadIndex" component={LoadIndexPage} />
                            
                            <Panel url="video" component={VideoPage} />
                            <Panel url="playEnding" component={playEnding} />
                            <Panel url="ending" component={EndingPage}/>
                            <Panel url="item" root={() => this.refs.item}>
                                <div className="full" ref="item">
                                    <h2 className="center" onClick={() => go("/s/index")}>Item Page1</h2>
                                </div>
                            </Panel>
                        </div>
                    </Panel>
                </div>
            </PanelContext>
            <PanelContext ref="popPanel" url="/loading" animation={PanelAnimation.fade}>
                <Panel url="s" component={PopPage} />
            </PanelContext>
        </div>
    }
}
/**
 * ending结束页
 * **/
class EndingPage extends React.Component {
    constructor(props){
        super(props) 
    }
    static defaultProps={
            isboys:true
    }
    render(){
        return (
            <div className="full" ref="root">
                <img ref="ending1" src={getImageUrl("ending/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"14rem"}} className="abs" />
                <img ref="ending2" src={getImageUrl("ending/2.png")} style={{left:"0.94rem",top:"2.89rem",width:"6.13rem",height:"5.24rem"}} className="abs" />
                <img ref="ending3" src={getImageUrl("ending/3.png")} style={{left:"2.47rem",top:"11.68rem",width:"2.56rem",height:"1.04rem"}} className="abs" />
            </div>
        )
    }
}
/**
 * 选择性别
 * **/
class SelectPage extends React.Component {
    constructor(props){
        super(props)
      
    }
    static defaultProps={
            isboys:true
    }
    render(){
        return (
            <div className="full" ref="root">
                <div className="page">
                    <img ref="select1" src={getImageUrl("select/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"14rem"}} className="abs" />
                    <img ref="select2" 
                        onClick={()=>go('/s/boys1')}
                        src={getImageUrl("select/2.png")} style={{left:"3.12rem",top:"8.65rem",width:"1.26rem",height:"1.53rem"}} className="abs" />
                    <img ref="select3" 
                        onClick={()=>go('/s/girl1')}
                        src={getImageUrl("select/3.png")} style={{left:"3.08rem",top:"5.82rem",width:"1.34rem",height:"1.48rem"}} className="abs" />
                    <img ref="select4" src={getImageUrl("select/4.png")} style={{left:"3.33rem",top:"3.63rem",width:"0.85rem",height:"0.38rem"}} className="abs" />
                    <img ref="select5" src={getImageUrl("select/5.png")} style={{left:"2.47rem",top:"11.68rem",width:"2.56rem",height:"1.04rem"}} className="abs" />
                </div>
                </div>
        )
    }
}
/**
 * soso第二页
 * **/
class SosoPage extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){
        setTimeout(()=>{
            go('/s/select')
        },1500)
    }
    render(){
        return (
            <div className="full" ref="root">
                <div className="page" ref="index"> 
                <img ref="soso1" src={getImageUrl("soso/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"14rem"}} className="abs" />
                <img ref="soso2" src={getImageUrl("soso/2.png")} style={{left:"1.49rem",top:"5.14rem",width:"4.01rem",height:"2.29rem"}} className="abs" />
                <img ref="soso3" src={getImageUrl("soso/3.png")} style={{left:"2.47rem",top:"11.68rem",width:"2.56rem",height:"1.04rem"}} className="abs" />
                </div>
            </div>

        )
    }
}
/**
 * 加载女孩1
 * **/
class Girl1Page extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){
        setTimeout(()=>{
            go('/s/girl2')
        },1500)
    }
    render(){
        return (
            <div className="full" ref="root">
            {console.log(this.props)}
                <img ref="girl11" src={getImageUrl("girl1/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"13.32rem"}} className="abs" />
                <img ref="girl12" src={getImageUrl("girl1/2.png")} style={{left:"1.1rem",top:"3.2rem",width:"4.37rem",height:"3.3rem"}} className="abs" />
                <img ref="girl13" src={getImageUrl("girl1/3.png")} style={{left:"2.45rem",top:"11.68rem",width:"2.57rem",height:"1.04rem"}} className="abs" />
            </div>
        )
    }
}

/**
 * 加载女孩2
 * **/
class Girl2Page extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){
        setTimeout(()=>{
            go('/s/girl3')
        },1500)
    }
    render(){
        return (
            <div className="full" ref="root">
                <img ref="girl21" src={getImageUrl("girl2/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"13.32rem"}} className="abs" />
                <img ref="girl22" src={getImageUrl("girl2/2.png")} style={{left:"1.94rem",top:"3.61rem",width:"3.84rem",height:"1.95rem"}} className="abs" />
                <img ref="girl23" src={getImageUrl("girl2/3.png")} style={{left:"2.47rem",top:"11.68rem",width:"2.56rem",height:"1.04rem"}} className="abs" />
            </div>
        )
    }
}
/**
 * 加载女孩3
 * **/
class Girl3Page extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){
        setTimeout(()=>{
            go('/s/loadIndex')
        },1500)
    }
    render(){
        return (
            <div className="full" ref="root">
                <img ref="girl31" src={getImageUrl("girl3/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"13.32rem"}} className="abs" />
                <img ref="girl32" src={getImageUrl("girl3/2.png")} style={{left:"1.77rem",top:"3.22rem",width:"4.37rem",height:"2.88rem"}} className="abs" />
                <img ref="girl33" src={getImageUrl("girl3/3.png")} style={{left:"2.47rem",top:"11.68rem",width:"2.57rem",height:"1.05rem"}} className="abs" />
            </div>
        )
    }
}
/**
 * 加载男孩1
 * **/
class Boys1Page extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){
        setTimeout(()=>{
            go('/s/boys2')
        },1500)
    }
    render(){
        return (
            <div className="full" ref="root">
                <img ref="boys11" src={getImageUrl("boys1/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"14rem"}} className="abs" />
                <img ref="boys12" src={getImageUrl("boys1/2.png")} style={{left:"1.95rem",top:"3.58rem",width:"3.63rem",height:"1.86rem"}} className="abs" />
                <img ref="boys13" src={getImageUrl("boys1/3.png")} style={{left:"2.47rem",top:"11.68rem",width:"2.56rem",height:"1.04rem"}} className="abs" />
                
            </div>
        )
    }
}

/**
 * 加载男孩2
 * **/
class Boys2Page extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){
        setTimeout(()=>{
            go('/s/boys3')
        },1500)
    }
    render(){
        return (
            <div className="full" ref="root">
                <img ref="boys21" src={getImageUrl("boys2/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"14rem"}} className="abs" />
                <img ref="boys22" src={getImageUrl("boys2/2.png")} style={{left:"1.09rem",top:"3.09rem",width:"5.45rem",height:"2.7rem"}} className="abs" />
                <img ref="boys23" src={getImageUrl("boys2/3.png")} style={{left:"2.45rem",top:"11.68rem",width:"2.57rem",height:"1.04rem"}} className="abs" />
            </div>
        )
    }
}
/**
 * 加载男孩3
 * **/
class Boys3Page extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){
        setTimeout(()=>{
            go('/s/loadIndex')
        },1500)
    }
    render(){
        return (
            <div className="full" ref="root">
                <img ref="boys31" src={getImageUrl("boys3/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"14rem"}} className="abs" />
                <img ref="boys32" src={getImageUrl("boys3/2.png")} style={{left:"1.16rem",top:"3.54rem",width:"5.16rem",height:"2.07rem"}} className="abs" />
                <img ref="boys33" src={getImageUrl("boys3/3.png")} style={{left:"2.47rem",top:"11.68rem",width:"2.56rem",height:"1.04rem"}} className="abs" />
            </div>
        )
    }
}
/**
 * 加载视频
 * **/
class VideoPage extends React.Component{

    constructor(props){
        super(props)
    }
    static  defaultProps = {
        isopen: true
    }
  
    componentWillMount(){
        this.setState({
            isopen :this.props.isopen,
            showEnd:"isshow"
        })
    }
    componentDidMount(){
        var psdWidth = 750;
        window.onresize= () => {
            var w = window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth;
            var fontSize = w * 100 / psdWidth;
            document.documentElement.style.fontSize = fontSize + 'px';
            //当在视屏转换纵屏时，退出视屏
            go('/s/ending')
        }
    }
 
    render(){
        return (
        <div className="full" ref="root">
            <img ref="skip1" src={getImageUrl("skip/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"4.17rem"}} className="abs" />
            {this.state.isopen ?
                <img ref="skip2" onClick={()=>{
                    console.log(this.state.isopen)
                    this.setState({
                        isopen:false
                    })
                    const that=this;
                   setTimeout(()=>{
                    console.log(this.refs.isshow)
                    const showEnd = this.refs.isshow;
                    showEnd.addEventListener("ended",function(){
                        console.log("video播放完毕");
                        that.setState({
                            isopen:true
                        })
                        //播放完成后提示转化
                        go("/s/playEnding", PanelAnimation.top)
                    },1000)
                   })
                }} src={getImageUrl("skip/2.png")}  style={{left:"0.62rem",top:"0.35rem",width:"6.26rem",height:"3.3rem"}} className="abs" />
                 :
                 <video ref="isshow" controls autoPlay  style={{left:"0.62rem",top:"0.35rem",width:"6.26rem",height:"3.3rem"}} className="abs">
                     <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
                 </video>}
                 <img ref="skip3" 
                      onClick={()=>go('/s/playEnding')}
                      src={getImageUrl("skip/3.png")} style={{left:"6.51rem",top:"3.9rem",width:"0.33rem",height:"0.09rem"}} className="abs" />
        </div>
        )
}
}
/**
 *加载转换横屏 
 * 
 *  **/
class LoadIndexPage extends React.Component{
    componentDidMount(){
        var psdWidth = 750;
        window.onresize= () => {
            var w = window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth;
            var fontSize = w * 100 / psdWidth;
            document.documentElement.style.fontSize = fontSize + 'px';
                
            go('/s/video',PanelAnimation.right)
        }
    }
    render(){
        return (<div className="center" ref="root">
                    <div className="page">
                        <img ref="wang1" src={getImageUrl("wang/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"14rem"}} className="abs" />
                    </div>
        </div>)
    }
}
/**
 *播放完之后的过度页 
 * 
 *  **/
class playEnding extends React.Component{
    componentDidMount(){
        var psdWidth = 750;
        window.onresize= () => {
            var w = window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth;
            var fontSize = w * 100 / psdWidth;
            document.documentElement.style.fontSize = fontSize + 'px';
            
            go('/s/ending')
        }
    }
    render(){
        return (
            <div className="full" ref="root">
                <img ref="071" src={getImageUrl("07/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"4.46rem"}} className="abs" />
                <img ref="074" src={getImageUrl("07/4.png")} style={{left:"3.2rem",top:"1.5rem",width:"1rem",height:"1rem"}} className="abs" />
            </div>
        )
    }
}
/**
 * 加载中…
 */

class LoadingPage extends React.Component {
    updateProgress = p => {
        //更新进度
        this.refs.percent.innerHTML = Math.round(p);
    };

    async loadAssets() {
        //加载素材
        await $.getScript(getVersionUrl("assets/images.js"));
        await loadImages(imagesJson);
    }

    async componentDidMount() {
        //淡入
        jTimeline.fromTo(this.refs.root, 0.4, { opacity: 0 }, { opacity: 1 });
        try {
            await this.loading(10, 2);
        }
        catch (e) {
            return alert(e.message);
        }
        //跳转到主页
        go("/s/index");
    }

    render() {
        return <div className="full" ref="root">
            <div className="page">
                <Flash className="abs" flash="loading" />
                <img ref="loading11" src={getImageUrl("loading1/1.png")} style={{left:"0rem",top:"0rem",width:"7.5rem",height:"14rem"}} className="abs" />
                <img ref="loading12" src={getImageUrl("loading1/2.png")} style={{left:"3.48rem",top:"6.73rem",width:"0.84rem",height:"0.32rem"}} className="abs" />
                <img ref="loading13" src={getImageUrl("loading1/3.png")} style={{left:"2.47rem",top:"11.68rem",width:"2.56rem",height:"1.04rem"}} className="abs" /><div className="center" style={{ top: "8.19rem", color: "#fff", fontSize: "0.27rem" }}><span ref="percent">0</span>%</div>
            </div>
        </div>
    }

    async loading(loadingTime, limitTime) {
        //跑模拟进度
        var line = jTimeline.to(jTimeline.temp(this.updateProgress)
            , loadingTime //模拟进度跑loadingTime秒
            , { val: 90 + Math.random() * 9 }); //模拟进度跑到90+卡住

        //防止加载过快看不到效果
        var limitWait = new Promise(ps => setTimeout(ps, limitTime * 1000));

        await this.loadAssets();

        //等待最小时间
        await limitWait;
        //干掉模拟进度
        line.kill();
        this.updateProgress(100);
    }
}


//启动
(async function () {
    //加载"loading page"所需要的图片
    await $.getScript(getVersionUrl("assets/loadImages.js"));
    await loadImages(loadImagesJson);

    //加载flash
    await $.getScript(getVersionUrl("assets/flash.js"));
    loadFlashImages();
    ReactDOM.render(<IndexPage />, document.getElementById("client_area"));
})();
