const btns = document.querySelectorAll('.btn');

window.onload = () => {
    btns.forEach(btn => {
        btn.innerHTML += `
                <svg class="background" width="815" height="429" viewBox="0 0 815 429"
                        xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <g clip-path="url(#clip0_71_8)">
                        <g filter="url(#filter0_d_71_8)">
                        <!-- Modificato da var(--color2) a var(--inside-c) -->
                        <path d="M8 111.475L108 8.9751H708L808 316.475L708 418.975H108L8 111.475Z"
                                fill="var(--inside-c)" />
                        <!-- Modificato da var(--color1) a var(--border-c) -->
                        <path d="M706.184 11.4751L805.154 315.811L706.946 416.475H109.816L10.8447 112.138L109.054 11.4751H706.184Z"
                                stroke="var(--border-c)" fill="var(--inside-c)" stroke-width="5" />
                        </g>
                        <!-- Altri tratti modificati a var(--border-c) -->
                        <path d="M708.514 10.0044L803.792 304.997C806.072 312.057 804.258 319.798 799.078 325.108L707.511 418.979"
                            stroke="var(--border-c)" stroke-width="19" stroke-linecap="round" fill="var(--inside-c)" />
                        <path d="M106.736 419.232L11.4578 124.239C9.17761 117.179 10.9923 109.438 16.172 104.128L107.739 10.257"
                            stroke="var(--border-c)" stroke-width="19" stroke-linecap="round" fill="var(--inside-c)" />
                    </g>
                    <defs>
                        <filter id="filter0_d_71_8" x="7" y="7.9751" width="802" height="412"
                                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                        result="hardAlpha" />
                        <feMorphology radius="1" operator="dilate" in="SourceAlpha"
                                        result="effect1_dropShadow_71_8" />
                        <feOffset />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix"
                                result="effect1_dropShadow_71_8" />
                        <feBlend mode="normal" in="SourceGraphic"
                                in2="effect1_dropShadow_71_8" result="shape" />
                        </filter>
                        <clipPath id="clip0_71_8">
                        <rect width="815" height="429" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                `;
    });
}