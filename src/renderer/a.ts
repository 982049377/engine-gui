import * as path from 'path';
import * as fs from 'fs';


export let run = () => {
    let canvas = document.getElementById("books") as HTMLCanvasElement;
    let stage = engine.run(canvas);

    let date: any;
    let bookArry: bookResource[] = []
    let bookitems: bookItem[] = [];

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
            bookArry = date.reource;
            for (var i = 0; i < bookArry.length; i++) {
                let bookitem = new bookItem(bookArry[i].name, bookArry[i].id, i);
                bookitems.push(bookitem);
            }
        }
    }
    var bookstore: BookStore = BookStore.getIntance();
    bookstore.bookItemList = bookitems;
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
    constructor(bookname: string, id: string, index: number) {
        super();
        this.book = new bookResource(name, id);
        this.index = index;
        this.desc = new engine.TextField();
        this.desc.text = name + "   " + id;
    }


}
class BookStore extends engine.DisplayObjectContainer {
    bookItemList: bookItem[] = [];
    private static instance: BookStore;
    constructor() {
        super();
    }
    static getIntance() {
        if (BookStore.instance == null) {
            return new BookStore();
        } else {
            return BookStore.instance;
        }
    }

    renovatelist() {
        let y = 0;
        for (var bookitem of this.bookItemList) {
            bookitem.x = 0;
            bookitem.y = y;
            y += 5;
            this.addChild(bookitem);
        }
    }

    addBook(bookitem: bookItem) {
        if (!this.hasBookItem(bookitem)) {
            this.bookItemList.push(bookitem);
        }
        this.renovatelist();
    }
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




// export function run (){
//     alert("Hello world");
// }