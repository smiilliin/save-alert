# Save-alert

This program helps you remember to save.  
If installed as an exe file, it will start automatically when the computer boots.

## Usage

### Settings

`C:\Users\(user name)\AppData\Roaming\save-alert\\settings.json`

```json
{
  "interval": 180000,
  "imageURL": "https://media.tenor.com/8AqUPOC5GMgAAAAi/parrot-party.gif",
  "text": "제발 파일을 저장하세요\n(Esc로 창 닫기)",
  "width": 500,
  "height": 500
}
```

| interval            | imageURL    | text       | width, height           |
| ------------------- | ----------- | ---------- | ----------------------- |
| save alert interval | alert image | alert text | window width and height |

### Install packages

```bash
npm install -g typescript nodemon eslint
npm install
```

### Run program

```bash
npm run start
```

### Release

```bash
npm run release
```
