const btns = document.querySelectorAll('.btn');
const btn_menu = document.querySelectorAll('.btn-menu');

window.onload = () => {
        btns.forEach(btn => {
                btn.innerHTML += `
                <svg class="background" width="825" height="440" viewBox="0 0 825 440" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <g clip-path="url(#clip0_71_8)">
                <g filter="url(#filter0_d_71_8)">
                <path d="M13 116.475L113 13.9751H713L813 321.475L713 423.975H113L13 116.475Z" fill="var(--background)" />
                <path d="M711.184 16.4751L810.154 320.811L711.946 421.475H114.816L15.8447 117.138L114.054 16.4751H711.184Z"
                        stroke="var(--border)" stroke-width="5" />
                </g>
                <path d="M111.736 424.232L16.4578 129.239C14.1776 122.179 15.9923 114.438 21.172 109.128L112.739 15.257"
                stroke="var(--border)" stroke-width="30" stroke-linecap="round" />
                <path d="M713.514 15.0044L808.792 309.997C811.072 317.057 809.258 324.798 804.078 330.108L712.511 423.979"
                stroke="var(--border)" stroke-width="30" stroke-linecap="round" />
                <path d="M713.514 15.0044L808.792 309.997C811.072 317.057 809.258 324.798 804.078 330.108L712.511 423.979"
                stroke="var(--border-light)" stroke-width="19" stroke-linecap="round" />
                <path d="M111.736 424.232L16.4578 129.239C14.1776 122.179 15.9923 114.438 21.172 109.128L112.739 15.257"
                stroke="var(--border-light)" stroke-width="19" stroke-linecap="round" />
                </g>
                <defs>
                <filter id="filter0_d_71_8" x="12" y="12.9751" width="802" height="412" filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_71_8" />
                <feOffset />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_71_8" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_71_8" result="shape" />
                </filter>
                <clipPath id="clip0_71_8">
                <rect width="825" height="440" fill="white" />
                </clipPath>
                </defs>
                </svg>
                `;
        });
        btn_menu.forEach(btn => {
                btn.innerHTML += `
                <svg class="background" width="634" height="434" viewBox="0 0 634 434" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <g clip-path="url(#clip0_81_2)">
                <path d="M620.5 351.905L619.325 352.949L544.325 419.616L543.331 420.5H90.6689L89.6748 419.616L14.6748 352.949L13.5 351.905V82.0947L14.6748 81.0508L89.6748 14.3838L90.6689 13.5H543.331L544.325 14.3838L619.325 81.0508L620.5 82.0947V351.905Z" fill="var(--background)" stroke="var(--border)" stroke-width="7"/>
                <path d="M542.5 10L620.542 77.5089C622.738 79.4084 624 82.1685 624 85.0719L624 348.449C624 351.34 622.749 354.09 620.569 355.989L542.5 424" stroke="var(--border)" stroke-width="20" stroke-linecap="round"/>
                <path d="M91.5003 10L13.4579 77.5089C11.262 79.4084 10.0001 82.1685 10.0001 85.0719L10 348.449C10 351.34 11.2513 354.09 13.4314 355.989L91.5003 424" stroke="var(--border)" stroke-width="20" stroke-linecap="round"/>
                </g>
                <defs>
                <clipPath id="clip0_81_2">
                <rect width="634" height="434" fill="white"/>
                </clipPath>
                </defs>
                </svg>
                `;
        });
}