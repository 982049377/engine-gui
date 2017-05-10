import * as path from 'path';
import * as fs from 'fs';


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
    engine.ResourceLoad.load("loading.png", (data) => { });
    engine.ResourceLoad.load("Add.png", (data) => { });
    engine.ResourceLoad.load("Slice.png", (data) => { });
    engine.ResourceLoad.load("Change.png", (data) => { });


    let projectUserPck = path.resolve(__dirname, "../../");
    let configPath = path.join(projectUserPck, "date.config")

    if (!fs.existsSync(configPath))
        alert("不是有效路径")
    else {
        let dateContent = fs.readFileSync(configPath, "UTF-8");
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

    
    ///因为删除把第0项删了所以下面消失了
    bookstore.bookItemList[0].addOptionBar();
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
        // this.desc.touchEnable = true;
        // this.desc.addEventListener(engine.MyTouchEvent.TouchClick, () => {
        // });
    }
    addOptionBar() {
        this.addChild(this.optionBar);
    }
}
class bookOptionBar extends engine.DisplayObjectContainer {
    addpic: engine.Bitmap;
    slipic: engine.Bitmap;
    changepic: engine.Bitmap;
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
            var newBook: bookItem = new bookItem("book04", "04", 4);
            var oldBook = BookStore.getInstance().bookItemList[0];
            BookStore.getInstance().changeBook(oldBook, newBook);
        });
    }
}


class BookStore extends engine.DisplayObjectContainer {
    bookItemList: bookItem[] = [];
    private static instance: BookStore;
    constructor() {
        super();
    }
    static getInstance() {
        if (BookStore.instance == null)
            BookStore.instance = new BookStore()
        return BookStore.instance;

    }

    renovatelist() {
        this.removeAllChild();
        let y = 25;
        for (var bookitem of this.bookItemList) {
            bookitem.x = 0;
            bookitem.y = y;
            y += 25;
            this.addChild(bookitem);
            bookitem.touchEnable = true;
        }
    }

    addBook(bookitem: bookItem) {
        if (!this.hasBookItem(bookitem)) {
            this.bookItemList.push(bookitem);
        }
        this.renovatelist();
    }
    ///删除得自己写一下比较逻辑，有问题
    sliceBook(bookitem: bookItem) {
        var index = this.bookItemList.indexOf(bookitem);
        if (index == -1) {
            console.error("没有这本书");
            return;
        }
        this.bookItemList.splice(index);
        this.renovatelist();
    }
    changeBook(oldBookItem: bookItem, newBookItem: bookItem) {
        if (this.hasBookItem(oldBookItem)) {
            var oldindex = this.bookItemList.indexOf(oldBookItem);
            this.bookItemList.splice(oldindex, 1, newBookItem);
        } else {
            this.addBook(newBookItem);
        }
        this.renovatelist();
    }

    private hasBookItem(bookitem: bookItem) {
        if (this.bookItemList.indexOf(bookitem) == -1)
            return false;
        else
            return true;
    }
}




// export function run() {
//     var canvas = document.getElementById("app") as HTMLCanvasElement;
//     alert(canvas);
// }