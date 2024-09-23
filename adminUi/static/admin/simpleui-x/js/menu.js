Vue.component('context-menu', {
    props: ['url'],
    data() {
        return {
            visible: false,
            position: { top: '0px', left: '0px' }
        };
    },
    methods: {
        openInNewTab() {
            if (this.url) {
                window.open(this.url, '_blank');
            }
            this.visible = false;
        },
        copyLink() {
            if (this.url) {
                navigator.clipboard.writeText(this.url).then(() => {
                    alert('تم نسخ الرابط بنجاح');
                });
            }
            this.visible = false;
        },
        closeMenu() {
            this.visible = false;
        },
        showContextMenu(event) {
            event.preventDefault();
            this.position.left = `${event.pageX}px`;
            this.position.top = `${event.pageY}px`;
            this.visible = true;
        }
    },
    template: `
        <div
            v-if="visible"
            class="context-menu"
            :style="{ top: position.top, left: position.left }"
        >
            <p @click="openInNewTab"><i class="el-icon-link"></i> فتح في علامة تبويب جديدة</p>
            <p @click="copyLink"><i class="el-icon-document"></i> نسخ الرابط</p>
            <p @click="closeMenu"><i class="el-icon-close"></i> إلغاء</p>
        </div>
    `,
    mounted() {
        document.addEventListener('click', this.closeMenu);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.closeMenu);
    }
});

Vue.component('sub-menu', {
    props: ['menus', 'fold'],
    data() {
        return {
            currentUrl: ''
        };
    },
    methods: {
        openTab(data) {
            window.app.openTab(data);
        },
        contextmenu(item, event) {
            event.preventDefault();
            console.log("ddddddddddd");
            this.currentUrl = item.eid;  // or item.url, depending on how you define URL in your data
            this.$refs.contextMenu.showContextMenu(event);
        }
    },
    template: `
        <div>
            <template v-for="(item, i) in menus" :key="item.eid">
                <el-menu-item
                    :index="item.eid"
                    v-if="!item.models"
                    @click="openTab(item)"
                    @contextmenu.prevent="contextmenu(item, $event)"
                >
                    <i :class="'menu-icon ' + item.icon"></i>
                    <span v-show="!fold" slot="title">{{ item.name }}</span>
                </el-menu-item>
                <el-submenu :index="item.eid" v-else>
                    <template slot="title">
                        <i :class="'menu-icon ' + item.icon"></i>
                        <span v-show="!fold">{{ item.name }}</span>
                    </template>
                    <sub-menu :menus="item.models" :fold="fold"></sub-menu>
                </el-submenu>
            </template>
            <!-- Include the context menu component -->
            <context-menu ref="contextMenu" :url="currentUrl" />
        </div>
    `
});

Vue.component('multiple-menu', {
    props: ['menus', 'menuActive', 'fold'],
    template: `
        <el-menu :unique-opened="true" :default-active="menuActive" :collapse="fold" :collapse-transition="true">
            <sub-menu :menus="menus" :fold="fold"></sub-menu>
        </el-menu>
    `
});

// Initialize Vue instance or app as needed
