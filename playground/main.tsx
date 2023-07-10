import { createApp, ref } from "vue";
import { useColorMode } from "@vueuse/core";
import "uno.css";

type ModeType = "light" | "dark" | "cafe";

createApp({
  setup() {
    const mode = useColorMode<ModeType>({
      selector: "html",
      attribute: "data-theme",
      modes: {
        light: "light",
        dark: "dark",
        cafe: "cafe"
      }
    });

    const modes: ModeType[] = ["light", "dark", "cafe"];

    const index = ref(0);

    function toggle() {
      index.value = index.value + 1;
      if (index.value >= modes.length) {
        index.value = 0;
      }
      mode.value = modes[index.value];
    }

    return () => (
      <div class="bg-secondary duration-300 flex h-full w-full items-center">
        <div class="flex shadow-md shadow-primary/30 m-auto duration-300  bg-gradient-to-r  from-tertiary/10 to-secondary/30 bg-light/72 h-120 w-120 justify-center items-center">
          <button class="bg-white  text-primary/90 duration-300 cursor-pointer border border-b-primary/100 outline-none border-solid h-12 text-light px-4 hover:bg-primary/78 active:bg-primary/60" onClick={toggle}>
            Toggle(
            {mode.store.value}
            )
          </button>
        </div>
      </div>
    );
  }
}).mount("#app");
