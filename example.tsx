
        import { createApp, ref } from "vue"
        import { useColorMode } from "@vueuse/core"
        import "uno.css"

        type ModeType = 'light' | 'dark' | 'cafe'

        createApp({
            setup() {

                const mode = useColorMode<ModeType>({
                    selector: "html",
                    attribute: "data-theme",
                    modes: {
                        'light': 'light',
                        'dark': 'dark',
                        'cafe': "cafe"
                    }
                })

                const modes:ModeType[]= ['light', 'dark', 'cafe']

                const index = ref(0)

                function toggle() {
                    index.value = index.value + 1
                    if (index.value >= modes.length) {
                        index.value = 0
                    }
                    mode.value = modes[index.value]
                }

                return () => (
                    <div class="bg-neutral flex h-full w-full items-center">
                        <div class="flex m-auto  bg-light-72 h-120 w-120 justify-center items-center">
                            <button onClick={toggle} class="bg-primary border border-transparent h-12 text-light w-20 hover:bg-primary-78 active:bg-primary-60">Toggle Theme</button>
                        </div>
                    </div>)
            }
        }).mount("#app")