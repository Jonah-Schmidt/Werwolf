const fs = require('fs');
const mediaFile = require('./mediaFile.json');

module.exports = {
    update() {
        fs.writeFileSync(`./src/mediaFile.json`, JSON.stringify(mediaFile), error => {
            if(error) console.log(error);
        });
    },
    set(type, category, object, value) {
        if(type == 'JSON') {
            if(!mediaFile[category]) {
                mediaFile[category] = {};
                mediaFile[category][object] = value;
                this.update();
            }
            else if(mediaFile[category]) {
                mediaFile[category][object] = value;
                this.update();
            };
        }
        else if(type == 'Array') {
            if(!mediaFile[category][object]) {
                mediaFile[category][object] = [];
                mediaFile[category][object].push(value);
                this.update();
            }
            else if(mediaFile[category][object]) {
                mediaFile[category][object].push(value);
                this.update();
            }
        };
    },
    remove(type, category, object, value) {
        if(type == 'JSON') {
            if(!mediaFile[category]) return;
            if(!mediaFile[category][object]) return;
            delete mediaFile[category][object];
            this.update();
        }
        else if(type == 'Array') {
            if(!mediaFile[category][object]) return;
            let Array = mediaFile[category][object];
            let cache = [];
            Array.forEach(element => {
                if(element == value) {
                    false;
                } else {
                    cache.push(element);
                };
            });
            mediaFile[category][object] = cache;
            this.update();
        }
    },
    get(type, category, object) {
        if(type == 'JSON') {
            if(!mediaFile[category]) return;
            let returnValue = mediaFile[category][object];
            return returnValue;
        }
        else if(type == 'Array') {
            if(mediaFile[category][object]) {
                let returnArray = mediaFile[category][object];
                return returnArray;
            };
        };
    }
};