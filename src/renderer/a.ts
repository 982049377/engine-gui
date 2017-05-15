import * as path from 'path';
import * as fs from 'fs';
import * as cp from "child_process";

export let run = () => {
    let canvas = document.getElementById("app") as HTMLCanvasElement;
    let stage = engine.run(canvas);

    let date: any;
    let bookArry: bookResource[] = []
    let bookitems: bookItem[] = [];
    var bookstore: BookStore = BookStore.getInstance();

    engine.ResourceManager.addImageJson("loading.png", "loading.png", 50, 50);
    engine.ResourceManager.addImageJson("Add.png", "Add.png", 50, 50);
    engine.ResourceManager.addImageJson("Slice.png", "Slice.png", 50, 50);
    engine.ResourceManager.addImageJson("Change.png", "Change.png", 50, 50);
    engine.ResourceManager.addImageJson("ret.png", "ret.png", 50, 50);
    engine.ResourceLoad.load("loading.png", (data) => { });
    engine.ResourceLoad.load("Add.png", (data) => { });
    engine.ResourceLoad.load("Slice.png", (data) => { });
    engine.ResourceLoad.load("Change.png", (data) => { });
    engine.ResourceLoad.load("ret.png", (data) => { });

    let projectUserPick = path.resolve(__dirname, "../../../canvas/engine_test");

    // console.log(projectUserPick);
    if (!validProject(projectUserPick)) {
        alert("不是一个有效的Unity项目");
    }
    else {
        let child_process = cp.exec("engine " + 'run ' + projectUserPick);
        // let child_process = cp.spawn("engine ", ['run ', projectUserPick]);
        let iframe: HTMLIFrameElement;
        child_process.stdout.addListener("data", data => {
            console.log(data.toString());
            engine.MysetTimeout(() => {
                if (data.toString().indexOf("Server listening to") >= 0) {
                    iframe = document.getElementById("iframe") as HTMLIFrameElement;
                    iframe.src = "http://localhost:1337/index.html";
                    // iframe.src = "http://localhost:1341";
                }
            }, 500);
        })
        child_process.stderr.addListener("data", data => {
            console.log(data.toString());
        })
        child_process.addListener("close", () => {
            // alert("close");
            // process.exit(code());
        })


        // process.addListener("exit", () => {
        //     child_process = cp.exec("Ctrl+C");
        //     child_process = cp.exec("Y");
        // })
        // let id = child_process.pid;
        // let code = () => {
        //     process.kill(id);
        //     alert("kill child_process");
        //     return 0;
        // }

    }
//输入的是项目路径
    function validProject(projectUserPick: string) {
        // return true;
        var ValidCredential = path.join(projectUserPick, "engine.json")
        //文件存在
        if (!fs.existsSync(ValidCredential)) {
            alert("不是一个Unity项目");
            return false;
        }
        //文件是否合法
        let dateContent = fs.readFileSync(ValidCredential, "UTF-8");
        try {
            date = JSON.parse(dateContent);
        }
        catch (e) {
            alert("解析JSON文件出现问题");
        }
        if (date) {
            let enginedir: string = date.engine;
            if (!enginedir) {
                alert("不是一个Unity项目")
                return false;
            }
        }
        return true;
        // return fs.existsSync(configPath) ? true : false;
    }


    let booksStore = path.resolve(__dirname, "../../");
    let configBooksStorePath = path.join(booksStore, "date.config")
    // alert(booksStore);
    if (!validProject(booksStore))
        alert("不是有效路径")
    else {
        let dateContent = fs.readFileSync(configBooksStorePath, "UTF-8");
        try {
            date = JSON.parse(dateContent);
        }
        catch (e) {
            alert("解析JSON文件出现问题");
        }
        if (date) {
            bookArry = date.resource;
            for (var i = 0; i < bookArry.length; i++) {
                let bookitem = new bookItem(bookArry[i].name, bookArry[i].id, i);
                // bookitems.push(bookitem);
                bookstore.addBook(bookitem);
            }
        }
    }


    stage.touchEnable = true;


    ///因为删除把第0项删了，所以下面消失了

    // bookstore.bookItemList[0].addOptionBar();
    // bookstore.bookItemList = bookitems;
    stage.addChild(bookstore);
}

class bookResource {
    name: string;
    id: string;
    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }
}

class bookItem extends engine.DisplayObjectContainer {
    book: bookResource;
    index: number;
    desc: engine.TextField;
    optionBar: bookOptionBar;
    constructor(bookname: string, id: string, index: number) {
        super();
        this.optionBar = new bookOptionBar();
        this.optionBar.touchEnable = true;
        this.optionBar.y = 300;
        this.book = new bookResource(bookname, id);
        this.index = index;
        this.desc = new engine.TextField();
        this.desc.text = bookname + "   " + id;
        // alert(this.desc.text);
        this.addChild(this.desc);
        this.desc.touchEnable = true;
        this.desc.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            if (!BookStore.hasBookOptionBar) {
                BookStore.hasBookOptionBar = true;
                this.addOptionBar();
            }
        });
    }
    addOptionBar() {
        this.addChild(this.optionBar);
    }
}
class bookOptionBar extends engine.DisplayObjectContainer {
    addpic: engine.Bitmap;
    slipic: engine.Bitmap;
    changepic: engine.Bitmap;
    retpic: engine.Bitmap;
    constructor() {
        super();
        this.addpic = new engine.Bitmap();
        this.addpic.x = 25;
        this.addpic.y = 0;
        this.addChild(this.addpic);
        this.addpic.src = "Add.png";

        this.slipic = new engine.Bitmap();
        this.slipic.x = 125;
        this.slipic.y = 0;
        this.addChild(this.slipic);
        this.slipic.src = "Slice.png";

        this.changepic = new engine.Bitmap();
        this.changepic.x = 225;
        this.changepic.y = 0;
        this.addChild(this.changepic);
        this.changepic.src = "Change.png";

        this.retpic = new engine.Bitmap();
        this.retpic.x = 325;
        this.retpic.y = 0;
        this.addChild(this.retpic);
        this.retpic.src = "ret.png";
        this.addevent();

    }
    addevent() {
        this.addpic.touchEnable = true;
        this.addpic.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            var book: bookItem = new bookItem("book04", "04", 4);
            BookStore.getInstance().addBook(book);
        });

        this.slipic.touchEnable = true;
        this.slipic.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            var book: bookItem = new bookItem("book02", "02", 2);
            BookStore.getInstance().sliceBook(book);
        });

        this.changepic.touchEnable = true;
        this.changepic.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            var newBook: bookItem = new bookItem("book05", "05", 5);
            var oldBook = BookStore.getInstance().bookItemList[0];
            BookStore.getInstance().changeBook(oldBook, newBook);
        });


        this.retpic.touchEnable = true;
        this.retpic.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            var tempbookitem = this.parent as engine.DisplayObjectContainer;
            tempbookitem.removeChild(this);
            BookStore.hasBookOptionBar = false;
        });
    }
}

class BookStore extends engine.DisplayObjectContainer {
    bookItemList: bookItem[] = [];
    private static instance: BookStore;
    public static hasBookOptionBar: boolean = false;
    constructor() {
        super();
    }
    static getInstance() {
        if (BookStore.instance == null)
            BookStore.instance = new BookStore()
        return BookStore.instance;

    }

    renovateDisplayList() {
        this.removeAllChild();
        let y = 25;
        for (var bookitem of this.bookItemList) {
            bookitem.x = 0;
            bookitem.y = y;
            y += 25;
            this.addChild(bookitem);
            bookitem.touchEnable = true;
        }
        this.renovateDataList();
    }

    renovateDataList() {
        let projectUserPck = path.resolve(__dirname, "../../");
        let configPath = path.join(projectUserPck, "date.config")
        let data: string = "{\"resource\":[\n";
        for (let element of this.bookItemList) {
            data = data.concat("{\n \"name\":\"" + element.book.name + "\",\n\"id\":\"" + element.book.id + "\"\n}");
            if (this.hasBookItem(element) == this.bookItemList.length - 1) {
                break;
            }
            data = data.concat(",\n")
        }
        data = data.concat("]\n}")
        if (!fs.existsSync(configPath))
            alert("不是有效路径")
        else {
            let dateContent = fs.writeFileSync(configPath, data, "UTF-8");
        }
    }

    addBook(bookitem: bookItem) {
        if (this.hasBookItem(bookitem) == -1) {
            this.bookItemList.push(bookitem);
        }
        this.renovateDisplayList();
    }
    ///删除得自己写一下比较逻辑，有问题
    sliceBook(bookitem: bookItem) {
        var index = this.hasBookItem(bookitem);
        if (index == -1) {
            console.error("没有这本书");
            return;
        }
        this.bookItemList.splice(index, 1);
        this.renovateDisplayList();
    }
    changeBook(oldBookItem: bookItem, newBookItem: bookItem) {
        if (this.hasBookItem(newBookItem) != -1) {
            alert("新书已经在目录中");
            return;
        }
        if (this.hasBookItem(oldBookItem) != -1) {
            var oldindex = this.hasBookItem(oldBookItem);
            this.bookItemList.splice(oldindex, 1, newBookItem);
        } else {
            this.addBook(newBookItem);
        }
        this.renovateDisplayList();
    }

    private hasBookItem(bookitem: bookItem): number {
        var index = 0;
        var Isfind = false;
        this.bookItemList.forEach(element => {
            if (bookitem.book.id == element.book.id) {
                Isfind = true;
            }
            if (Isfind) return;
            index++;
        });

        return (!Isfind) ? -1 : index;
        // if(!Isfind)return -1;
        // else return index;
    }
}




// export function run() {
//     var canvas = document.getElementById("app") as HTMLCanvasElement;
//     alert(canvas);
// }