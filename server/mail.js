const nodemailer = require("nodemailer");
const { mail } = require("../config");
let transporter = nodemailer.createTransport(
    `smtps://${encodeURI(mail.username)}:${encodeURI(mail.password)}@${
        mail.smtp_server
    }/?pool=true`
);
/**
 * Send a e-mail with HTML content.
 * @param {string} receiver The receiver of the mail. Required.
 * @param {string} subject The mail subject. Required.
 * @param {string} body The HTML content of the mail. Required.
 * @param {string} sender The sender name and address. Optional. Default is the one specified in config.js
 */
function sendHTMLMail(
    receiver,
    subject,
    body,
    callback = function (info) {},
    sender = mail.name
) {
    transporter
        .sendMail({
            from: sender,
            to: decodeURIComponent(receiver),
            subject: subject,
            html: body,
        })
        .then(function (info) {
            callback(info);
        })
        .catch(function (err) {
            console.warn(err);
        });
}
function getEmailConfirmationHTMLContent(username, privateID) {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>officr</title>
    </head>
    <body>
        <div class="header">
            <svg
                width="1220"
                height="351"
                viewBox="0 0 1220 351"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M570.28 280.152C556.072 280.152 543.208 276.888 531.688 270.36C520.36 263.832 511.432 254.808 504.904 243.288C498.376 231.576 495.112 218.424 495.112 203.832C495.112 189.24 498.376 176.184 504.904 164.664C511.432 152.952 520.36 143.832 531.688 137.304C543.208 130.776 556.072 127.512 570.28 127.512C584.488 127.512 597.256 130.776 608.584 137.304C620.104 143.832 629.128 152.952 635.656 164.664C642.184 176.184 645.448 189.24 645.448 203.832C645.448 218.424 642.184 231.576 635.656 243.288C629.128 254.808 620.104 263.832 608.584 270.36C597.256 276.888 584.488 280.152 570.28 280.152ZM570.28 267.192C581.8 267.192 592.072 264.504 601.096 259.128C610.312 253.752 617.512 246.264 622.696 236.664C628.072 227.064 630.76 216.12 630.76 203.832C630.76 191.544 628.072 180.6 622.696 171C617.512 161.4 610.312 153.912 601.096 148.536C592.072 143.16 581.8 140.472 570.28 140.472C558.76 140.472 548.392 143.16 539.176 148.536C530.152 153.912 522.952 161.4 517.576 171C512.392 180.6 509.8 191.544 509.8 203.832C509.8 216.12 512.392 227.064 517.576 236.664C522.952 246.264 530.152 253.752 539.176 259.128C548.392 264.504 558.76 267.192 570.28 267.192ZM735.338 76.536C716.522 76.536 707.114 86.616 707.114 106.776V128.664H755.21V141.048H707.402V279H693.002V141.048H665.354V128.664H693.002V105.624C693.002 92.952 696.65 82.872 703.946 75.384C711.242 67.896 721.514 64.152 734.762 64.152C740.522 64.152 745.994 65.016 751.178 66.744C756.554 68.28 760.97 70.68 764.426 73.944L758.666 84.888C752.522 79.32 744.746 76.536 735.338 76.536ZM829.838 76.536C811.022 76.536 801.614 86.616 801.614 106.776V128.664H849.71V141.048H801.902V279H787.502V141.048H759.854V128.664H787.502V105.624C787.502 92.952 791.15 82.872 798.446 75.384C805.742 67.896 816.014 64.152 829.262 64.152C835.022 64.152 840.494 65.016 845.678 66.744C851.054 68.28 855.47 70.68 858.926 73.944L853.166 84.888C847.022 79.32 839.246 76.536 829.838 76.536ZM902.126 128.664H916.526V279H902.126V128.664ZM909.326 92.088C906.062 92.088 903.278 91.032 900.974 88.92C898.67 86.616 897.518 83.832 897.518 80.568C897.518 77.304 898.67 74.52 900.974 72.216C903.278 69.912 906.062 68.76 909.326 68.76C912.59 68.76 915.374 69.912 917.678 72.216C919.982 74.328 921.134 77.016 921.134 80.28C921.134 83.544 919.982 86.328 917.678 88.632C915.374 90.936 912.59 92.088 909.326 92.088ZM1036.89 280.152C1022.3 280.152 1009.25 276.888 997.726 270.36C986.206 263.832 977.182 254.808 970.654 243.288C964.126 231.576 960.862 218.424 960.862 203.832C960.862 189.048 964.126 175.896 970.654 164.376C977.182 152.664 986.206 143.64 997.726 137.304C1009.25 130.776 1022.3 127.512 1036.89 127.512C1048.99 127.512 1059.93 129.912 1069.73 134.712C1079.71 139.32 1087.77 146.136 1093.92 155.16L1083.26 162.936C1077.89 155.448 1071.17 149.88 1063.1 146.232C1055.23 142.392 1046.49 140.472 1036.89 140.472C1025.18 140.472 1014.62 143.16 1005.21 148.536C995.998 153.72 988.702 161.112 983.326 170.712C978.142 180.312 975.55 191.352 975.55 203.832C975.55 216.312 978.142 227.352 983.326 236.952C988.702 246.552 995.998 254.04 1005.21 259.416C1014.62 264.6 1025.18 267.192 1036.89 267.192C1046.49 267.192 1055.23 265.368 1063.1 261.72C1071.17 257.88 1077.89 252.216 1083.26 244.728L1093.92 252.504C1087.77 261.528 1079.71 268.44 1069.73 273.24C1059.93 277.848 1048.99 280.152 1036.89 280.152ZM1150.85 161.496C1155.46 150.552 1162.66 142.2 1172.45 136.44C1182.24 130.488 1194.15 127.512 1208.16 127.512V141.624L1204.71 141.336C1188 141.336 1174.95 146.616 1165.54 157.176C1156.13 167.544 1151.43 182.04 1151.43 200.664V279H1137.03V128.664H1150.85V161.496Z"
                    fill="black"
                />
                <mask
                    id="mask0"
                    mask-type="alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="351"
                    height="351"
                >
                    <path
                        d="M175.5 0L299.597 51.4028L351 175.5L299.597 299.597L175.5 351L51.4028 299.597L0 175.5L51.4028 51.4028L175.5 0Z"
                        fill="#730000"
                    />
                </mask>
                <g mask="url(#mask0)">
                    <rect
                        width="567.396"
                        height="383.996"
                        transform="matrix(0.875239 -0.483691 0.516488 0.856294 -124.134 107.895)"
                        fill="#730000"
                    />
                    <g filter="url(#filter0_d)">
                        <rect
                            width="217.562"
                            height="380.842"
                            transform="matrix(0.968647 0.248439 -0.269568 0.962981 139.76 20.4864)"
                            fill="#8E0101"
                        />
                    </g>
                    <g filter="url(#filter1_d)">
                        <rect
                            width="213.557"
                            height="388.262"
                            transform="matrix(0.722398 0.691478 -0.722398 0.691478 319.004 81.9455)"
                            fill="#A80000"
                        />
                    </g>
                    <g filter="url(#filter2_d)">
                        <rect
                            width="215.878"
                            height="435.066"
                            transform="matrix(0.875239 -0.483691 0.516488 0.856294 48.5121 7.44949)"
                            fill="#B50000"
                        />
                    </g>
                    <g filter="url(#filter3_d)">
                        <rect
                            width="217.48"
                            height="380.997"
                            transform="matrix(0.964335 -0.264683 0.286968 0.95794 159.805 -28.4796)"
                            fill="#D40000"
                        />
                    </g>
                </g>
                <defs>
                    <filter
                        id="filter0_d"
                        x="17.0976"
                        y="10.4864"
                        width="333.404"
                        height="440.795"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                    <filter
                        id="filter1_d"
                        x="18.5244"
                        y="71.9455"
                        width="454.753"
                        height="436.145"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                    <filter
                        id="filter2_d"
                        x="28.5121"
                        y="-106.969"
                        width="433.652"
                        height="496.963"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                    <filter
                        id="filter3_d"
                        x="139.805"
                        y="-96.0428"
                        width="339.057"
                        height="442.536"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                </defs>
            </svg>
        </div>
        <div class="content">
            Dear ${username}<br /><br />Your officr account was created successfully. <br>Please confirm you e-mail to verify that this is you.<br /><br />
            <a href="${mail.host}/signup/confirmemail?id=${privateID}" class="button">Click here to verify your e-mail.</a>
        </div>
        <div class="footer">
            This mail was sent automatically. Please do not respond.<br>If you have not created an account with this e-mail address, just ignore this e-mail.
        </div>
        <style>
            :root {
                text-align: center;
            }
            body {
                display: flex;
                position: absolute;
                left: 50%;
                transform: translate(-50%);
                color: black;
                font-family: "Verdana";
                font-size: medium;
                gap: 3rem;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                max-width: 100vw;
                padding: 2ch;
                max-width: 80vw;
            }
            svg {
                height: 3rem;
                margin: 1rem;
            }
            .button {
                display: block;
                background-color: #d40000;
                color: white;
                padding: 1rem 3rem;
                margin: 1rem;
                border-radius: 10rem;
                text-decoration: none;
                transition: 0.2s;
            }
            .button:hover {
                background-color: hsl(0, 100%, 70%);
            }
            .footer {
                font-size: 0.75rem;
                overflow-wrap: break-word;
                word-wrap: break-word;
                white-space: normal;
                hyphens: auto;
            }
        </style>
    </body>
</html>

`;
}
function getRegisteredHTMLMailContent(username) {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>officr</title>
    </head>
    <body>
        <div class="header">
            <svg
                width="1220"
                height="351"
                viewBox="0 0 1220 351"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M570.28 280.152C556.072 280.152 543.208 276.888 531.688 270.36C520.36 263.832 511.432 254.808 504.904 243.288C498.376 231.576 495.112 218.424 495.112 203.832C495.112 189.24 498.376 176.184 504.904 164.664C511.432 152.952 520.36 143.832 531.688 137.304C543.208 130.776 556.072 127.512 570.28 127.512C584.488 127.512 597.256 130.776 608.584 137.304C620.104 143.832 629.128 152.952 635.656 164.664C642.184 176.184 645.448 189.24 645.448 203.832C645.448 218.424 642.184 231.576 635.656 243.288C629.128 254.808 620.104 263.832 608.584 270.36C597.256 276.888 584.488 280.152 570.28 280.152ZM570.28 267.192C581.8 267.192 592.072 264.504 601.096 259.128C610.312 253.752 617.512 246.264 622.696 236.664C628.072 227.064 630.76 216.12 630.76 203.832C630.76 191.544 628.072 180.6 622.696 171C617.512 161.4 610.312 153.912 601.096 148.536C592.072 143.16 581.8 140.472 570.28 140.472C558.76 140.472 548.392 143.16 539.176 148.536C530.152 153.912 522.952 161.4 517.576 171C512.392 180.6 509.8 191.544 509.8 203.832C509.8 216.12 512.392 227.064 517.576 236.664C522.952 246.264 530.152 253.752 539.176 259.128C548.392 264.504 558.76 267.192 570.28 267.192ZM735.338 76.536C716.522 76.536 707.114 86.616 707.114 106.776V128.664H755.21V141.048H707.402V279H693.002V141.048H665.354V128.664H693.002V105.624C693.002 92.952 696.65 82.872 703.946 75.384C711.242 67.896 721.514 64.152 734.762 64.152C740.522 64.152 745.994 65.016 751.178 66.744C756.554 68.28 760.97 70.68 764.426 73.944L758.666 84.888C752.522 79.32 744.746 76.536 735.338 76.536ZM829.838 76.536C811.022 76.536 801.614 86.616 801.614 106.776V128.664H849.71V141.048H801.902V279H787.502V141.048H759.854V128.664H787.502V105.624C787.502 92.952 791.15 82.872 798.446 75.384C805.742 67.896 816.014 64.152 829.262 64.152C835.022 64.152 840.494 65.016 845.678 66.744C851.054 68.28 855.47 70.68 858.926 73.944L853.166 84.888C847.022 79.32 839.246 76.536 829.838 76.536ZM902.126 128.664H916.526V279H902.126V128.664ZM909.326 92.088C906.062 92.088 903.278 91.032 900.974 88.92C898.67 86.616 897.518 83.832 897.518 80.568C897.518 77.304 898.67 74.52 900.974 72.216C903.278 69.912 906.062 68.76 909.326 68.76C912.59 68.76 915.374 69.912 917.678 72.216C919.982 74.328 921.134 77.016 921.134 80.28C921.134 83.544 919.982 86.328 917.678 88.632C915.374 90.936 912.59 92.088 909.326 92.088ZM1036.89 280.152C1022.3 280.152 1009.25 276.888 997.726 270.36C986.206 263.832 977.182 254.808 970.654 243.288C964.126 231.576 960.862 218.424 960.862 203.832C960.862 189.048 964.126 175.896 970.654 164.376C977.182 152.664 986.206 143.64 997.726 137.304C1009.25 130.776 1022.3 127.512 1036.89 127.512C1048.99 127.512 1059.93 129.912 1069.73 134.712C1079.71 139.32 1087.77 146.136 1093.92 155.16L1083.26 162.936C1077.89 155.448 1071.17 149.88 1063.1 146.232C1055.23 142.392 1046.49 140.472 1036.89 140.472C1025.18 140.472 1014.62 143.16 1005.21 148.536C995.998 153.72 988.702 161.112 983.326 170.712C978.142 180.312 975.55 191.352 975.55 203.832C975.55 216.312 978.142 227.352 983.326 236.952C988.702 246.552 995.998 254.04 1005.21 259.416C1014.62 264.6 1025.18 267.192 1036.89 267.192C1046.49 267.192 1055.23 265.368 1063.1 261.72C1071.17 257.88 1077.89 252.216 1083.26 244.728L1093.92 252.504C1087.77 261.528 1079.71 268.44 1069.73 273.24C1059.93 277.848 1048.99 280.152 1036.89 280.152ZM1150.85 161.496C1155.46 150.552 1162.66 142.2 1172.45 136.44C1182.24 130.488 1194.15 127.512 1208.16 127.512V141.624L1204.71 141.336C1188 141.336 1174.95 146.616 1165.54 157.176C1156.13 167.544 1151.43 182.04 1151.43 200.664V279H1137.03V128.664H1150.85V161.496Z"
                    fill="black"
                />
                <mask
                    id="mask0"
                    mask-type="alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="351"
                    height="351"
                >
                    <path
                        d="M175.5 0L299.597 51.4028L351 175.5L299.597 299.597L175.5 351L51.4028 299.597L0 175.5L51.4028 51.4028L175.5 0Z"
                        fill="#730000"
                    />
                </mask>
                <g mask="url(#mask0)">
                    <rect
                        width="567.396"
                        height="383.996"
                        transform="matrix(0.875239 -0.483691 0.516488 0.856294 -124.134 107.895)"
                        fill="#730000"
                    />
                    <g filter="url(#filter0_d)">
                        <rect
                            width="217.562"
                            height="380.842"
                            transform="matrix(0.968647 0.248439 -0.269568 0.962981 139.76 20.4864)"
                            fill="#8E0101"
                        />
                    </g>
                    <g filter="url(#filter1_d)">
                        <rect
                            width="213.557"
                            height="388.262"
                            transform="matrix(0.722398 0.691478 -0.722398 0.691478 319.004 81.9455)"
                            fill="#A80000"
                        />
                    </g>
                    <g filter="url(#filter2_d)">
                        <rect
                            width="215.878"
                            height="435.066"
                            transform="matrix(0.875239 -0.483691 0.516488 0.856294 48.5121 7.44949)"
                            fill="#B50000"
                        />
                    </g>
                    <g filter="url(#filter3_d)">
                        <rect
                            width="217.48"
                            height="380.997"
                            transform="matrix(0.964335 -0.264683 0.286968 0.95794 159.805 -28.4796)"
                            fill="#D40000"
                        />
                    </g>
                </g>
                <defs>
                    <filter
                        id="filter0_d"
                        x="17.0976"
                        y="10.4864"
                        width="333.404"
                        height="440.795"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                    <filter
                        id="filter1_d"
                        x="18.5244"
                        y="71.9455"
                        width="454.753"
                        height="436.145"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                    <filter
                        id="filter2_d"
                        x="28.5121"
                        y="-106.969"
                        width="433.652"
                        height="496.963"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                    <filter
                        id="filter3_d"
                        x="139.805"
                        y="-96.0428"
                        width="339.057"
                        height="442.536"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                </defs>
            </svg>
        </div>
        <div class="content">
            Dear ${username}<br /><br />Your officr account was created successfully. You should now be able to log into your account.<br /><br />
            <a href="${mail.host}/login" class="button">Log in now</a>
        </div>
        <div class="footer">
            This mail was sent automatically. Please do not respond.
        </div>
        <style>
            :root {
                text-align: center;
            }
            body {
                display: flex;
                position: absolute;
                left: 50%;
                transform: translate(-50%);
                color: black;
                font-family: "Verdana";
                font-size: medium;
                gap: 3rem;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                max-width: 100vw;
                padding: 2ch;
                max-width: 80vw;
            }
            svg {
                height: 3rem;
                margin: 1rem;
            }
            .button {
                display: block;
                background-color: #d40000;
                color: white;
                padding: 1rem 3rem;
                margin: 1rem;
                border-radius: 10rem;
                text-decoration: none;
                transition: 0.2s;
            }
            .button:hover {
                background-color: hsl(0, 100%, 70%);
            }
            .footer {
                font-size: 0.75rem;
                overflow-wrap: break-word;
                word-wrap: break-word;
                white-space: normal;
                hyphens: auto;
            }
        </style>
    </body>
</html>

`;
}
function getPasswordResetHTMLContent(username, privateID) {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>officr</title>
    </head>
    <body>
        <div class="header">
            <svg
                width="1220"
                height="351"
                viewBox="0 0 1220 351"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M570.28 280.152C556.072 280.152 543.208 276.888 531.688 270.36C520.36 263.832 511.432 254.808 504.904 243.288C498.376 231.576 495.112 218.424 495.112 203.832C495.112 189.24 498.376 176.184 504.904 164.664C511.432 152.952 520.36 143.832 531.688 137.304C543.208 130.776 556.072 127.512 570.28 127.512C584.488 127.512 597.256 130.776 608.584 137.304C620.104 143.832 629.128 152.952 635.656 164.664C642.184 176.184 645.448 189.24 645.448 203.832C645.448 218.424 642.184 231.576 635.656 243.288C629.128 254.808 620.104 263.832 608.584 270.36C597.256 276.888 584.488 280.152 570.28 280.152ZM570.28 267.192C581.8 267.192 592.072 264.504 601.096 259.128C610.312 253.752 617.512 246.264 622.696 236.664C628.072 227.064 630.76 216.12 630.76 203.832C630.76 191.544 628.072 180.6 622.696 171C617.512 161.4 610.312 153.912 601.096 148.536C592.072 143.16 581.8 140.472 570.28 140.472C558.76 140.472 548.392 143.16 539.176 148.536C530.152 153.912 522.952 161.4 517.576 171C512.392 180.6 509.8 191.544 509.8 203.832C509.8 216.12 512.392 227.064 517.576 236.664C522.952 246.264 530.152 253.752 539.176 259.128C548.392 264.504 558.76 267.192 570.28 267.192ZM735.338 76.536C716.522 76.536 707.114 86.616 707.114 106.776V128.664H755.21V141.048H707.402V279H693.002V141.048H665.354V128.664H693.002V105.624C693.002 92.952 696.65 82.872 703.946 75.384C711.242 67.896 721.514 64.152 734.762 64.152C740.522 64.152 745.994 65.016 751.178 66.744C756.554 68.28 760.97 70.68 764.426 73.944L758.666 84.888C752.522 79.32 744.746 76.536 735.338 76.536ZM829.838 76.536C811.022 76.536 801.614 86.616 801.614 106.776V128.664H849.71V141.048H801.902V279H787.502V141.048H759.854V128.664H787.502V105.624C787.502 92.952 791.15 82.872 798.446 75.384C805.742 67.896 816.014 64.152 829.262 64.152C835.022 64.152 840.494 65.016 845.678 66.744C851.054 68.28 855.47 70.68 858.926 73.944L853.166 84.888C847.022 79.32 839.246 76.536 829.838 76.536ZM902.126 128.664H916.526V279H902.126V128.664ZM909.326 92.088C906.062 92.088 903.278 91.032 900.974 88.92C898.67 86.616 897.518 83.832 897.518 80.568C897.518 77.304 898.67 74.52 900.974 72.216C903.278 69.912 906.062 68.76 909.326 68.76C912.59 68.76 915.374 69.912 917.678 72.216C919.982 74.328 921.134 77.016 921.134 80.28C921.134 83.544 919.982 86.328 917.678 88.632C915.374 90.936 912.59 92.088 909.326 92.088ZM1036.89 280.152C1022.3 280.152 1009.25 276.888 997.726 270.36C986.206 263.832 977.182 254.808 970.654 243.288C964.126 231.576 960.862 218.424 960.862 203.832C960.862 189.048 964.126 175.896 970.654 164.376C977.182 152.664 986.206 143.64 997.726 137.304C1009.25 130.776 1022.3 127.512 1036.89 127.512C1048.99 127.512 1059.93 129.912 1069.73 134.712C1079.71 139.32 1087.77 146.136 1093.92 155.16L1083.26 162.936C1077.89 155.448 1071.17 149.88 1063.1 146.232C1055.23 142.392 1046.49 140.472 1036.89 140.472C1025.18 140.472 1014.62 143.16 1005.21 148.536C995.998 153.72 988.702 161.112 983.326 170.712C978.142 180.312 975.55 191.352 975.55 203.832C975.55 216.312 978.142 227.352 983.326 236.952C988.702 246.552 995.998 254.04 1005.21 259.416C1014.62 264.6 1025.18 267.192 1036.89 267.192C1046.49 267.192 1055.23 265.368 1063.1 261.72C1071.17 257.88 1077.89 252.216 1083.26 244.728L1093.92 252.504C1087.77 261.528 1079.71 268.44 1069.73 273.24C1059.93 277.848 1048.99 280.152 1036.89 280.152ZM1150.85 161.496C1155.46 150.552 1162.66 142.2 1172.45 136.44C1182.24 130.488 1194.15 127.512 1208.16 127.512V141.624L1204.71 141.336C1188 141.336 1174.95 146.616 1165.54 157.176C1156.13 167.544 1151.43 182.04 1151.43 200.664V279H1137.03V128.664H1150.85V161.496Z"
                    fill="black"
                />
                <mask
                    id="mask0"
                    mask-type="alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="351"
                    height="351"
                >
                    <path
                        d="M175.5 0L299.597 51.4028L351 175.5L299.597 299.597L175.5 351L51.4028 299.597L0 175.5L51.4028 51.4028L175.5 0Z"
                        fill="#730000"
                    />
                </mask>
                <g mask="url(#mask0)">
                    <rect
                        width="567.396"
                        height="383.996"
                        transform="matrix(0.875239 -0.483691 0.516488 0.856294 -124.134 107.895)"
                        fill="#730000"
                    />
                    <g filter="url(#filter0_d)">
                        <rect
                            width="217.562"
                            height="380.842"
                            transform="matrix(0.968647 0.248439 -0.269568 0.962981 139.76 20.4864)"
                            fill="#8E0101"
                        />
                    </g>
                    <g filter="url(#filter1_d)">
                        <rect
                            width="213.557"
                            height="388.262"
                            transform="matrix(0.722398 0.691478 -0.722398 0.691478 319.004 81.9455)"
                            fill="#A80000"
                        />
                    </g>
                    <g filter="url(#filter2_d)">
                        <rect
                            width="215.878"
                            height="435.066"
                            transform="matrix(0.875239 -0.483691 0.516488 0.856294 48.5121 7.44949)"
                            fill="#B50000"
                        />
                    </g>
                    <g filter="url(#filter3_d)">
                        <rect
                            width="217.48"
                            height="380.997"
                            transform="matrix(0.964335 -0.264683 0.286968 0.95794 159.805 -28.4796)"
                            fill="#D40000"
                        />
                    </g>
                </g>
                <defs>
                    <filter
                        id="filter0_d"
                        x="17.0976"
                        y="10.4864"
                        width="333.404"
                        height="440.795"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                    <filter
                        id="filter1_d"
                        x="18.5244"
                        y="71.9455"
                        width="454.753"
                        height="436.145"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                    <filter
                        id="filter2_d"
                        x="28.5121"
                        y="-106.969"
                        width="433.652"
                        height="496.963"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                    <filter
                        id="filter3_d"
                        x="139.805"
                        y="-96.0428"
                        width="339.057"
                        height="442.536"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dx="-10" />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                        />
                    </filter>
                </defs>
            </svg>
        </div>
        <div class="content">
            Dear ${username}<br /><br />To reset your password, click on the button below.<br /><br />
            <a href="${mail.host}/login/reset_password/reset?id=${privateID}" class="button">Reset Password</a>
        </div>
        <div class="footer">
            This mail was sent automatically. Please do not respond.<br>If you have not created an password reset request for your account, just ignore this e-mail.
        </div>
        <style>
            :root {
                text-align: center;
            }
            body {
                display: flex;
                position: absolute;
                left: 50%;
                transform: translate(-50%);
                color: black;
                font-family: "Verdana";
                font-size: medium;
                gap: 3rem;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                max-width: 100vw;
                padding: 2ch;
                max-width: 80vw;
            }
            svg {
                height: 3rem;
                margin: 1rem;
            }
            .button {
                display: block;
                background-color: #d40000;
                color: white;
                padding: 1rem 3rem;
                margin: 1rem;
                border-radius: 10rem;
                text-decoration: none;
                transition: 0.2s;
            }
            .button:hover {
                background-color: hsl(0, 100%, 70%);
            }
            .footer {
                font-size: 0.75rem;
                overflow-wrap: break-word;
                word-wrap: break-word;
                white-space: normal;
                hyphens: auto;
            }
        </style>
    </body>
</html>

`;
}
module.exports = {
    sendHTMLMail,
    getRegisteredHTMLMailContent,
    getEmailConfirmationHTMLContent,
    getPasswordResetHTMLContent,
};
