const { ccclass, property } = cc._decorator;

interface RequestOptions {
    data?: any;
    headers?: Record<string, string>;
}

@ccclass
export default class Util {
    static getRequest(url: string, options?: RequestOptions): Promise<any> {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        // 设置请求头（如果有）
        if (options?.headers) {
            for (const [key, value] of Object.entries(options.headers)) {
                xhr.setRequestHeader(key, value);
            }
        }

        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    } else {
                        reject(new Error(`Request failed with status ${xhr.status}`));
                    }
                }
            };

            xhr.send();
        });
    }
    static postRequest(url: string, options?: RequestOptions): Promise<any> {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);

        // 设置请求头（如果有）
        if (options?.headers) {
            for (const [key, value] of Object.entries(options.headers)) {
                xhr.setRequestHeader(key, value);
            }
        }

        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    } else {
                        reject(new Error(`Request failed with status ${xhr.status}`));
                        console.log(xhr.responseText)
                    }
                }
            };

            xhr.send(JSON.stringify(options?.data));
        });
    }
}
