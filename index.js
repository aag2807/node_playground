import * as http from "http";
import * as fs from "fs";
import chalk from "chalk";

const PORT = 8080;

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (url == "/message" && method == "POST") {
    const body = [];

    req.on("data", (data) => {
      body.push(data);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      let info = parsedBody.split("=")[1];
      while (info.includes("+") || info.includes('%')) {
        info = info.replace("+", " ");
      }
      fs.writeFileSync("./test/test.txt", info);
    });

    res.writeHead(302, { Location: "/" });
    res.end();
  }

  if (req.url == "/") {
    res.setHeader("Content-Type", "text/html");
    res.write(`
			<html>
				<head>
				<title>
					Title Message
				</title>
				</head>			
				<body>
					<form action="/message" method="POST">
						<input type="text" name="message"/>
					</form>
				</body>
			</html>
		`);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(chalk.gray(`running in port:${PORT}`));
});
