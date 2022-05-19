'use strict';
function getElement(string, item = document.documentElement) {
    let tmp = item.querySelector(string);
    if (tmp === null) {
        throw new Error("Unknow HTML");
    }
    return tmp;
}
function getParent(item) {
    let tmp = item.parentElement;
    if (tmp === null) {
        throw new Error("Unknow HTML");
    }
    return tmp;
}
class dust {
    constructor() {
        this.x = 50;
        this.y = 50;
        this.vx = Math.random() * 2 + 2;
        this.vy = Math.random() * 2;
        this.color = '#fff';
        this.shadowBlur = Math.random() * 3;
        this.shadowX = (Math.random() * 2) - 1;
        this.shadowY = (Math.random() * 2) - 1;
        this.radiusX = Math.random() * 3;
        this.radiusY = Math.random() * 3;
        this.rotation = Math.PI * Math.floor(Math.random() * 2);
    }
}
class canvasDust {
    constructor(canvasID) {
        this.width = 300;
        this.height = 300;
        this.dustQuantity = 50;
        this.dustArr = [];
        this.build = () => {
            this.resize();
            if (this.ctx) {
                const point = canvasDust.getPoint(this.dustQuantity);
                for (let i of point) {
                    const dustObj = new dust();
                    this.buildDust(i[0], i[1], dustObj);
                    this.dustArr.push(dustObj);
                }
                setInterval(this.play, 40);
            }
        };
        this.play = () => {
            var _a;
            const dustArr = this.dustArr;
            (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.width, this.height);
            for (let i of dustArr) {
                if (i.x < 0 || i.y < 0) {
                    const x = this.width;
                    const y = Math.floor(Math.random() * window.innerHeight);
                    i.x = x;
                    i.y = y;
                    this.buildDust(x, y, i);
                }
                else {
                    const x = i.x - i.vx;
                    const y = i.y - i.vy;
                    this.buildDust(x, y, i);
                }
            }
        };
        this.buildDust = (x, y, dust) => {
            const ctx = this.ctx;
            if (x)
                dust.x = x;
            if (y)
                dust.y = y;
            if (ctx) {
                ctx.beginPath();
                ctx.shadowBlur = dust.shadowBlur;
                ctx.shadowColor = dust.color;
                ctx.shadowOffsetX = dust.shadowX;
                ctx.shadowOffsetY = dust.shadowY;
                ctx.ellipse(dust.x, dust.y, dust.radiusX, dust.radiusY, dust.rotation, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = dust.color;
                ctx.fill();
            }
        };
        this.resize = () => {
            const canvas = this.canvas;
            const width = window.innerWidth;
            const height = window.innerHeight;
            this.width = width;
            this.height = height;
            this.dustQuantity = Math.floor((width + height) / 38);
            if (canvas !== undefined) {
                canvas.width = width;
                canvas.height = height;
            }
        };
        const canvas = getElement(canvasID);
        if (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.build();
            window.addEventListener('resize', () => this.resize());
        }
        else {
            throw new Error('canvasID 无效');
        }
    }
}
canvasDust.getPoint = (number = 1) => {
    let point = [];
    for (let i = 0; i < number; i++) {
        const x = Math.floor(Math.random() * window.innerWidth);
        const y = Math.floor(Math.random() * window.innerHeight);
        point.push([x, y]);
    }
    return point;
};
try {
    new canvasDust('#canvas-dust');
}
catch (e) { }
class Code {
    constructor() {
        this.reverse = (item, s0, s1) => {
            const block = getParent(item);
            if (block.classList.contains(s0)) {
                block.classList.remove(s0);
                block.classList.add(s1);
            }
            else {
                block.classList.remove(s1);
                block.classList.add(s0);
            }
        };
        this.doAsCode = (item) => {
            getElement('.code-copy', item).addEventListener('click', (click) => {
                const button = click.target;
                navigator.clipboard.writeText(getElement('code', item).innerText);
                button.classList.add('copied');
                setTimeout(() => button.classList.remove('copied'), 1200);
            });
            getElement('.code-header', item).addEventListener('click', (click) => {
                if (!click.target.classList.contains('code-copy')) {
                    this.reverse(click.currentTarget, 'open', 'fold');
                }
            });
        };
        this.findCode = () => {
            let codeBlocks = document.querySelectorAll('.highlight');
            if (codeBlocks !== null) {
                codeBlocks.forEach(item => {
                    if (!item.getAttribute('code-find')) {
                        this.doAsCode(item);
                        item.setAttribute('code-find', '');
                    }
                });
            }
        };
        this.findCode();
    }
}
let code = new Code();
class Cursor {
    constructor() {
        this.now = new MouseEvent('');
        this.first = true;
        this.last = 0;
        this.moveIng = false;
        this.fadeIng = false;
        this.outer = getElement('#cursor-outer').style;
        this.effecter = getElement('#cursor-effect').style;
        this.attention = "a,input,button,.admonition,.code-header,.gt-user-inner,.gt-header-textarea,.navBtnIcon";
        this.move = (timestamp) => {
            if (this.now !== undefined) {
                let SX = this.outer.left, SY = this.outer.top, preX = Number(SX.substring(0, SX.length - 2)), preY = Number(SY.substring(0, SY.length - 2)), delX = (this.now.x - preX) * 0.3, delY = (this.now.y - preY) * 0.3;
                if (timestamp - this.last > 15) {
                    preX += delX;
                    preY += delY;
                    this.outer.left = preX.toFixed(2) + 'px';
                    this.outer.top = preY.toFixed(2) + 'px';
                    this.last = timestamp;
                }
                if (Math.abs(delX) > 0.2 || Math.abs(delY) > 0.2) {
                    window.requestAnimationFrame(this.move);
                }
                else {
                    this.moveIng = false;
                }
            }
        };
        this.reset = (mouse) => {
            if (!this.moveIng) {
                this.moveIng = true;
                window.requestAnimationFrame(this.move);
            }
            this.now = mouse;
            if (this.first) {
                this.first = false;
                this.outer.left = String(this.now.x) + 'px';
                this.outer.top = String(this.now.y) + 'px';
            }
        };
        this.Aeffect = (mouse) => {
            if (this.fadeIng == false) {
                this.fadeIng = true;
                this.effecter.left = String(mouse.x) + 'px';
                this.effecter.top = String(mouse.y) + 'px';
                this.effecter.transition =
                    'transform .5s cubic-bezier(0.22, 0.61, 0.21, 1)\
        ,opacity .5s cubic-bezier(0.22, 0.61, 0.21, 1)';
                this.effecter.transform = 'translate(-50%, -50%) scale(1)';
                this.effecter.opacity = '0';
                setTimeout(() => {
                    this.fadeIng = false;
                    this.effecter.transition = '';
                    this.effecter.transform = 'translate(-50%, -50%) scale(0)';
                    this.effecter.opacity = '1';
                }, 500);
            }
        };
        this.hold = () => {
            this.outer.height = '24px';
            this.outer.width = '24px';
            this.outer.background = "rgba(255, 255, 255, 0.5)";
        };
        this.relax = () => {
            this.outer.height = '36px';
            this.outer.width = '36px';
            this.outer.background = "unset";
        };
        this.pushHolder = (items) => {
            items.forEach(item => {
                if (!item.classList.contains('is--active')) {
                    item.addEventListener('mouseover', this.hold, { passive: true });
                    item.addEventListener('mouseout', this.relax, { passive: true });
                }
            });
        };
        this.pushHolders = () => {
            this.pushHolder(document.querySelectorAll(this.attention));
        };
        this.effecter.transform = 'translate(-50%, -50%) scale(0)';
        this.effecter.opacity = '1';
        window.addEventListener('mousemove', this.reset, { passive: true });
        window.addEventListener('click', this.Aeffect, { passive: true });
        this.pushHolders();
        const observer = new MutationObserver(this.pushHolders);
        observer.observe(document, { childList: true, subtree: true });
    }
}
new Cursor();
class Index {
    constructor() {
        this.setItem = (item) => {
            item.classList.add('active');
            let parent = getParent(item), brother = parent.children;
            for (let i = 0; i < brother.length; i++) {
                const item = brother.item(i);
                if (item.classList.contains('toc-child')) {
                    item.classList.add('has-active');
                    break;
                }
            }
            for (; parent.classList[0] != 'toc'; parent = getParent(parent)) {
                if (parent.classList[0] == 'toc-child') {
                    parent.classList.add('has-active');
                }
            }
        };
        this.reset = () => {
            let tocs = document.querySelectorAll('#toc-div .active');
            let tocTree = document.querySelectorAll('#toc-div .has-active');
            tocs.forEach(item => {
                item.classList.remove('active');
            });
            tocTree.forEach(item => {
                item.classList.remove('has-active');
            });
        };
        this.modifyIndex = (headerLink, tocLink) => {
            let index = [];
            headerLink.forEach(item => {
                index.push(item.getBoundingClientRect().top);
            });
            this.reset();
            for (let i = 0; i < tocLink.length; ++i) {
                const item = tocLink.item(i);
                if (i + 1 == index.length || (index[i + 1] > 150 && (index[i] <= 150 || i == 0))) {
                    this.setItem(item);
                    break;
                }
            }
        };
        this.setHtml = () => {
            let headerLink = document.querySelectorAll('.headerlink'), tocLink = document.querySelectorAll('.toc-link');
            if (tocLink.length !== 0) {
                this.setItem(tocLink.item(0));
            }
            getElement('main').addEventListener('scroll', () => {
                if (tocLink.length === 0)
                    return;
                this.modifyIndex(headerLink, tocLink);
            }, { passive: true });
        };
        document.addEventListener('pjax:success', this.setHtml);
        this.setHtml();
    }
}
new Index();
class Header {
    constructor() {
        this.header = getElement('header');
        this.button = getElement('.navBtnIcon');
        this.closeSearch = false;
        this.relabel = () => {
            let navs = this.header.querySelectorAll('.navItem'), mayLen = 0, may = navs.item(0);
            getElement('.navBtn').classList.remove('hide');
            navs.forEach(item => {
                if (item.classList.contains('search-header')) {
                    return;
                }
                let now = item, link = getElement('a', now);
                if (link !== null) {
                    let href = link.href, match = now.getAttribute('matchdata');
                    now.classList.remove('active');
                    if (href.length > mayLen && document.URL.match(href) !== null) {
                        mayLen = href.length;
                        may = now;
                    }
                    if (match) {
                        const s = match.split(',');
                        s.forEach(item => {
                            if (document.URL.match(item) !== null) {
                                may = now;
                                mayLen = Infinity;
                            }
                        });
                    }
                }
            });
            if (may !== null) {
                may.classList.add('active');
            }
        };
        this.open = () => {
            scrolls.slideDown();
            this.header.classList.add('expanded');
            this.header.classList.add('moving');
            this.header.classList.remove('closed');
            setTimeout(() => this.header.classList.remove('moving'), 300);
        };
        this.close = () => {
            this.header.classList.add('closed');
            this.header.classList.add('moving');
            this.header.classList.remove('expanded');
            setTimeout(() => this.header.classList.remove('moving'), 300);
        };
        this.reverse = () => {
            if (this.closeSearch) {
                this.closeSearch = false;
            }
            else if (this.header.classList[0] === 'expanded') {
                this.close();
            }
            else {
                this.open();
            }
        };
        this.relabel();
        document.addEventListener('pjax:success', this.relabel);
        this.button.addEventListener('mousedown', () => {
            if (document.querySelector('.search')) {
                this.closeSearch = true;
            }
        });
        this.button.onclick = this.reverse;
    }
}
var header = new Header();
class Scroll {
    constructor() {
        this.scrolling = 0;
        this.getingtop = false;
        this.height = 0;
        this.visible = false;
        this.touchX = 0;
        this.touchY = 0;
        this.mayNotUp = false;
        this.reallyUp = false;
        this.intop = false;
        this.startTop = false;
        this.scrolltop = () => {
            getElement('main').scroll({ top: 0, left: 0, behavior: 'smooth' });
            this.totop.style.opacity = '0';
            this.getingtop = true;
            setTimeout(() => this.totop.style.display = 'none', 300);
        };
        this.totopChange = (post) => {
            if (post.getBoundingClientRect().top < -200) {
                this.totop.style.display = '';
                this.visible = true;
                setTimeout(() => {
                    if (this.visible) {
                        this.totop.style.opacity = '1';
                    }
                }, 300);
            }
            else {
                this.totop.style.opacity = '0';
                this.visible = false;
                setTimeout(() => {
                    if (!this.visible) {
                        this.totop.style.display = 'none';
                    }
                }, 300);
            }
        };
        this.slideDown = () => {
            if (!this.intop) {
                return;
            }
            const main = getElement('main').classList;
            main.remove('up');
            main.add('down');
            main.add('moving');
            setTimeout(() => {
                main.remove('down');
                main.remove('moving');
            }, 300);
            this.intop = false;
        };
        this.slideUp = () => {
            if (this.intop) {
                return;
            }
            getElement('.navBtn').classList.remove('hide');
            getElement('main').classList.add('up');
            getElement('main').classList.add('moving');
            this.intop = true;
            setTimeout(() => getElement('main').classList.remove('moving'), 300);
        };
        this.setHtml = () => {
            try {
                let navBtn = getElement('.navBtn');
                let onScroll = () => {
                    try {
                        let nowheight = getElement('article').getBoundingClientRect().top, post = getElement('#post-title');
                        if (this.height >= nowheight && this.intop) {
                            this.slideDown();
                        }
                        if (!document.querySelector('.expanded')) {
                            if (this.height - nowheight > 100) {
                                navBtn.classList.add('hide');
                                this.height = nowheight;
                            }
                            else if (nowheight > this.height) {
                                if (nowheight - this.height > 20) {
                                    navBtn.classList.remove('hide');
                                }
                                this.height = nowheight;
                            }
                        }
                        ++this.scrolling;
                        setTimeout(() => {
                            if (!--this.scrolling) {
                                this.getingtop = false;
                            }
                        }, 100);
                        if (!this.getingtop) {
                            this.totopChange(post);
                        }
                    }
                    catch (e) { }
                };
                this.totop = getElement('#to-top');
                this.height = 0;
                this.visible = false;
                getElement('main').addEventListener('scroll', onScroll);
            }
            catch (e) { }
        };
        this.checkTouchMove = (event) => {
            if (Math.abs(event.changedTouches[0].screenX - this.touchX) > 50 && !this.reallyUp) {
                this.mayNotUp = true;
            }
            if (document.querySelector('.expanded') ||
                window.innerWidth > 1024 ||
                this.mayNotUp ||
                event.changedTouches[0].screenY == this.touchY) {
                return;
            }
            if (this.startTop || getElement('article').getBoundingClientRect().top >= 0) {
                this.reallyUp = true;
                if (event.changedTouches[0].screenY > this.touchY) {
                    this.slideUp();
                }
                else {
                    this.slideDown();
                }
                this.touchY = event.changedTouches[0].screenY;
            }
        };
        this.startTouch = (event) => {
            this.touchX = event.changedTouches[0].screenX;
            this.touchY = event.changedTouches[0].screenY;
            this.mayNotUp = false;
            this.startTop = getElement('article').getBoundingClientRect().top >= 0;
        };
        document.addEventListener('pjax:success', this.setHtml);
        if (document.querySelector('.search-header')) {
            document.addEventListener('touchstart', this.startTouch);
            document.addEventListener('touchmove', this.checkTouchMove);
            document.addEventListener('wheel', (event) => {
                if (document.querySelector('.expanded') || window.innerWidth > 1024) {
                    return;
                }
                if (getElement('article').getBoundingClientRect().top >= 0) {
                    if (event.deltaY < 0) {
                        this.slideUp();
                    }
                    else {
                        this.slideDown();
                    }
                }
            });
        }
        this.setHtml();
        this.totop = document.querySelector('#to-top');
    }
}
var scrolls = new Scroll();
class pjaxSupport {
    constructor() {
        this.loading = getElement('.loading');
        this.left = getElement('.loadingBar.left');
        this.right = getElement('.loadingBar.right');
        this.timestamp = 0;
        this.start = (need) => {
            this.left.style.width = need + '%';
            this.right.style.width = need + '%';
            ++this.timestamp;
        };
        this.loaded = () => {
            ++this.timestamp;
            if (this.loading.style.opacity === '1') {
                getElement('main').scrollTop = 0;
                header.close();
                if (this.left.style.width !== "50%") {
                    this.start(50);
                    setTimeout((time) => {
                        if (this.timestamp == time) {
                            this.loading.style.opacity = '0';
                        }
                    }, 600, this.timestamp);
                }
            }
        };
        document.addEventListener('pjax:send', () => {
            if (getElement('main').classList.contains('up')) {
                scrolls.slideDown();
            }
            this.loading.classList.add('reset');
            this.start(0);
            setTimeout((time) => {
                if (this.timestamp == time) {
                    this.loading.style.opacity = '1';
                    this.loading.classList.remove('reset');
                    this.start(15);
                    setTimeout((time) => {
                        if (this.timestamp == time) {
                            this.start(30);
                        }
                    }, 800, this.timestamp);
                }
            }, 10, this.timestamp);
        });
        document.addEventListener('pjax:start', this.loaded);
        document.addEventListener('pjax:complete', this.loaded);
    }
}
try {
    new pjaxSupport();
}
catch (e) { }
/// <reference path="_include/canvaDust.ts" />
/// <reference path="_include/Code.ts" />
/// <reference path="_include/cursors.ts" />
/// <reference path="_include/Index.ts" />
/// <reference path="_include/Header.ts" />
/// <reference path="_include/scroll.ts" />
/// <reference path="_include/pjaxSupport.ts" />
