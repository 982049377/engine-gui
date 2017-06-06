import * as path from 'path';
import * as fs from 'fs';
import * as cp from "child_process";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import InputField from '../tsx/Inputt';

export let run = () => {
    let canvas = document.getElementById("app") as HTMLCanvasElement;
    let stage = engine.run(canvas);

    let date: any;
    let bookArryDate: bookResource[] = []
    let bookitems: bookView[] = [];


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

    var bookstore: BookStore = BookStore.getInstance();

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
            bookArryDate = date.resource;
            let bookList = [];
            for (var i = 0; i < bookArryDate.length; i++) {
                var index: number = parseInt(bookArryDate[i].id);
                let bookitem = new bookView(bookArryDate[i].name, bookArryDate[i].id, index);
                // bookitems.push(bookitem);
                bookList.push(bookitem);
                // bookstore.addBook(bookitem);
            }
            bookstore.addBookList(bookList);
        }
    }

    stage.touchEnable = true;


    ///因为删除把第0项删了，所以下面消失了

    // bookstore.bookItemList[0].addOptionBar();
    // bookstore.bookItemList = bookitems;
    stage.addChild(bookstore);
    ReactDOM.render(
        <InputField />, document.getElementById('inputtt')
    )
}

enum BookType {
    bookResource = 1,
    bookView = 2
}

export class bookResource {
    kind = BookType.bookResource;
    name: string;
    id: string;
    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }
}

export class bookView extends engine.DisplayObjectContainer {
    kind = BookType.bookView;
    book: bookResource;//数据层
    index: number;
    // desc: engine.TextField;
    // optionBar: bookOptionBar;
    constructor(bookname: string, id: string, index?: number, desc?: string) {
        super();
        // this.optionBar = new bookOptionBar();
        // this.optionBar.touchEnable = true;
        // this.optionBar.y = 300 ;
        this.book = new bookResource(bookname, id);
        if (index != undefined && index != null)
            this.index = index;

        this.refreshView(bookname, id, desc);

    }

    refreshView(bookname: string, id: string, desc?: string) {
        var BookNameView = new engine.TextField();
        BookNameView.text = "name:" + bookname;
        var BookIDView = new engine.TextField();
        BookIDView.text = "id:" + id;
        var BookDescView = new engine.TextField();
        if (desc == undefined || desc == null)
            BookDescView.text = "Descript:" + bookname + "   " + id;
        else
            BookDescView.text = "Descript:" + desc;

        BookNameView.x = 0;
        BookIDView.x = 50;
        BookDescView.x = 0;
        BookDescView.y = 8;

        this.addChild(BookNameView);
        this.addChild(BookIDView);
        this.addChild(BookDescView);

        BookNameView.touchEnable = true;
        BookNameView.addEventListener(engine.MyTouchEvent.TouchClick, this.Click);
        BookIDView.touchEnable = true;
        BookIDView.addEventListener(engine.MyTouchEvent.TouchClick, this.Click);
        BookDescView.touchEnable = true;
        BookDescView.addEventListener(engine.MyTouchEvent.TouchClick, this.Click);
    }
    Click = () => {
        if (!BookStore.hasBookOptionBar) {
            // BookStore.hasBookOptionBar = true;
            BookStore.getInstance().addOptionBar(this.book);
        }
    }

    // addOptionBar() {
    //     this.addChild(this.optionBar);
    // }
}
class bookOptionBar extends engine.DisplayObjectContainer {
    addpic: engine.Bitmap;
    slipic: engine.Bitmap;
    changepic: engine.Bitmap;
    retpic: engine.Bitmap;
    private _book: bookResource;
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
    setbook(book: bookResource) {
        this._book = book;
    }
    addevent() {
        this.addpic.touchEnable = true;
        this.addpic.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            // var book: bookItem = new bookItem("book04", "04", 4);
            // BookStore.getInstance().addBook(book);
            BookStore.hasBookOptionBar = true;
        });

        this.slipic.touchEnable = true;
        this.slipic.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            // var book: bookView = new bookView("book02", "02", 2);
            BookStore.getInstance().sliceBook(this._book);
            BookStore.hasBookOptionBar = false;
        });

        this.changepic.touchEnable = true;
        this.changepic.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            // var newBook: bookView = new bookView("book05", "05", 5);
            // var oldBook = BookStore.getInstance().bookItemList[0];
            // BookStore.getInstance().changeBook(oldBook, newBook);
            BookStore.hasBookOptionBar = true;
        });


        this.retpic.touchEnable = true;
        this.retpic.addEventListener(engine.MyTouchEvent.TouchClick, () => {
            BookStore.getInstance().removeOptionBar();
            BookStore.hasBookOptionBar = false;
        });
    }
}

export class BookStore extends engine.DisplayObjectContainer {
    bookItemList: bookView[] = [];
    private static instance: BookStore;
    public static hasBookOptionBar: boolean = false;
    public static optionBar: bookOptionBar;
    constructor() {
        super();
        BookStore.optionBar = new bookOptionBar();
        BookStore.optionBar.touchEnable = true;
        BookStore.optionBar.y = 300;
    }
    addOptionBar(Book: bookResource) {
        BookStore.optionBar.setbook(Book);
        this.addChild(BookStore.optionBar);
    }
    removeOptionBar() {
        this.removeChild(BookStore.optionBar);
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
            bookitem.y = bookitem.index * 50;
            console.log(bookitem.index);
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

    addBook(bookitem: bookView | bookResource) {
        if (this.hasBookItem(bookitem) != -1) {
            return;
        }
        switch (bookitem.kind) {
            case BookType.bookView:
                var tempBookView = bookitem as bookView;
                if ((tempBookView).index == null || (bookitem as bookView).index == undefined)
                    tempBookView.index = this.getProperIndex();
                this.bookItemList.push(tempBookView);
                break;
            case BookType.bookResource:
                var book = bookitem as bookResource;
                var tempBookView = new bookView(book.name, book.id, this.bookItemList.length);
                this.bookItemList.push(tempBookView);
                break;
            default:
                return;
        }
        this.numbers.push(tempBookView.index);
        this.renovateDisplayList();
    }
    private numbers = [];
    getProperIndex() {

        this.insertion_sort(this.numbers);

        var index: number = this.fFindMissedNumber(this.numbers);
        return index;
    }

    private _index: number;
    fFindMissedNumber(list: number[]) {
        var subListUp: number[] = [];
        var subListBack: number[] = [];
        for (var i = 0; i < Math.floor(list.length / 2); i++) {
            subListUp.push(list[i]);
        }
        for (var i = Math.floor(list.length / 2); i < list.length; i++) {
            subListBack.push(list[i]);
        }
        if ((list[list.length - 1] + list[0]) / 2 > list[Math.floor(list.length / 2)]) {
            if (subListUp[0] + 1 == subListBack[0] && list.length == 2)
                return subListBack[0] - 2;
            if (subListBack.length == 1)
                return this._index < subListBack[0] - 1 ? this._index : subListBack[0] - 1;
            this._index = this.fFindMissedNumber(subListBack);
        }
        if ((list[list.length - 1] + list[0]) / 2 <= list[Math.floor(list.length / 2)]) {
            if (subListUp[0] + 1 == subListBack[0] && list.length == 2)
                return subListUp[0] + 2;
            if (subListUp.length == 1)
                return this._index < subListUp[0] + 1 ? this._index : subListUp[0] + 1;
            this._index = this.fFindMissedNumber(subListUp);
        }
        return this._index;
    }
    insertion_sort(unsorted: number[]) {
        for (var i = 1; i < unsorted.length; i++) {
            if (unsorted[i - 1] > unsorted[i]) {
                var temp = unsorted[i];
                var j = i;
                while (j > 0 && unsorted[j - 1] > temp) {
                    unsorted[j] = unsorted[j - 1];
                    j--;
                }
                unsorted[j] = temp;
            }
        }
    }
    ///还有逻辑要完善
    addBookList(bookitems: bookView[]) {
        if (this.bookItemList == [])
            this.bookItemList = bookitems;
        else {
            bookitems.forEach(bookitemselement => {
                if (this.hasBookItem(bookitemselement) == -1)
                    this.addBook(bookitemselement);
            });
        }
        this.bookItemList.forEach(element => {
            this.numbers.push(element.index)
        });
        this.renovateDisplayList();
    }
    ///删除得自己写一下比较逻辑，有问题
    sliceBook(bookitem: bookView | bookResource) {
        var index = this.hasBookItem(bookitem);
        if (index == -1) {
            console.error("没有这本书");
            return;
        }
        this.bookItemList.splice(index, 1);
        this.renovateDisplayList();
    }

    addOrChangeBook(bookitem: bookView | bookResource) {
        var index = this.hasBookItem(bookitem);
        if (index == -1)
            this.addBook(bookitem);
        else
            this.changeBook(bookitem, this.bookItemList[index]);
        this.renovateDisplayList();
    }

    changeBook(oldBookItem: bookView | bookResource, newBookItem: bookView) {
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

    private hasBookItem(bookitem: bookView | bookResource): number {
        if (bookitem.kind == BookType.bookView) {
            var tempbook = (bookitem as bookView).book;
        }
        if (bookitem.kind == BookType.bookResource) {
            var tempbook = bookitem as bookResource;
        }
        var index = 0;
        var Isfind = false;
        this.bookItemList.forEach(element => {
            if (tempbook.id == element.book.id) {
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