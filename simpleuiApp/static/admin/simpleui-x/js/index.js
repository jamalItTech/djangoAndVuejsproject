(function () {
    if (window.frameElement) {
        window.frameElement.contentWindow.parent.callback()
    }

    window.addEventListener('hashchange', function (e) {
        if (e.newURL != e.oldURL) {
            openByHash()
        }
    });

    function openByHash() {
        var hash = location.hash;
        hash = hash.substring(1)

        for (var i = 0; i < app.menuData.length; i++) {
            var item = app.menuData[i]
            if ((item.url || '/') == hash) {
                console.log("hسسسaييييsh = hash.substring(1)",hash.substring(1))

                app.openTab(item, item.eid, true, false);
                break;
            }
        }
    }

    function changeUrl(data) {
        if (data.url && data.url.indexOf('http') != 0) {
            location.hash = '#' + (data.url || '/')
        }
    }

    window.callback = function () {
        window.location.reload()
    }

    var fontConfig = new Vue({
        // el: '#dynamicCss',
        data: {
            fontSize: null
        },
        created: function () {
            var val = getCookie('fontSize');
            if (val) {
                this.fontSize = parseInt(val);
            } else {
                this.fontSize = 0;
            }
        },
        watch: {
            fontSize: function (newValue) {
                if (newValue != 0) {
                    var fontStyle = document.getElementById('fontStyle');
                    if (!fontStyle) {
                        fontStyle = document.createElement('style');
                        fontStyle.id = 'fontStyle';
                        fontStyle.type = 'text/css';
                        document.head.append(fontStyle);
                    }
                    fontStyle.innerHTML = '*{font-size:' + newValue + 'px!important;}'

                } else {
                    var fontStyle = document.getElementById('fontStyle');
                    if (fontStyle) {
                        fontStyle.remove();
                    }
                }
            }
        },
        methods: {}
    });

    // Waves.init();

    //为元素注册水波纹效果
    Vue.directive('waves', {
        // 当被绑定的元素插入到 DOM 中时……
        inserted: function (el) {
            // 聚焦元素
            Waves.attach(el);
            Waves.init();
        }
    });


    window.getLanuage = function (key) {
        if (!window.Lanuages) {
            return "";
        }
        var val = Lanuages[key];
        if (!val || val == "") {
            val = key;
        }
        return val
    }

    new Vue({
        el: '#main',
        data: {
            drawer: false,
            mobile: false,
            tabModel: sessionStorage.getItem('activeTab') || 0, // استرجاع `tabModel` من `sessionStorage`
            dialogs: [], // Array to hold dialog data
            dialogSettings: {
              visible: false,
              title: '',
              width: '50%',
              fullscreen: false,
              customClass: '',
              modal: true,
              defaultCloseHandler: true,
              defaultHeaderActionHandler: true,
              defaultFooterButtonClickHandler: true,
              closeOnClickModal: true,
              closeOnPressEscape: true,
              dialogStyle: {},
              headerClass: '',
              headerContent: '',
              headerStyle: {},
              headerActions: [],
              contentStyle: {},
              content: '',
              contentType: 'iframe',
              footer: true,
              footerButtons: [],
              tableData: [],
              tableColumns: [],
              formModel: {},
              formRules: {},
              formFields: [],
              dynamicComponent: null,
              dynamicData: {}
          },
            upgrade: {
                isUpdate: false,
                body: '',
                version: '',
                dialogVisible: false
            },
            isResize: false,
            searchInput: '',
            height: 1000,
            fold: false,
            zoom: false,
            timeline: true,
            tabs: [home],
            resizeObserver: null,
            changePUrl:window.urls.changePassword,
            tabIndex: 0,
            menus: [],
            menuActive: '0',
            breadcrumbs: [],
            language: window.language,
            dialogConfig: {},
            dialogWidth: "50%",
            dialogHeight: "auto",
            themeDialogVisible: false,
            small: false,
            themes: SimpleuiThemes,
            theme: "",
            themeName: "",
            tabUsage:0,
            observer: null,
            currentTab: null // التبويبة الحالية
,

            iframeHeight: "auto", // Set a default height
            iframeWidth: "auto", // Set a default height

            popup: {
                left: 0,
                top: 0,
                show: false,
                tab: null,
                menus: [{
                    text: getLanuage('Refresh'),
                    icon: 'el-icon-refresh',
                    handler: function (tab, item) {
                        try {
                            document.getElementById(tab.id).contentWindow.location.reload(true);
                        } catch (e) {
                            console.log(e)
                            var url = tab.url.split('?')[0];
                            tab.url = url + '?_=' + new Date().getTime()
                        }
                    }
                }, {
                    text: getLanuage('Close current'),
                    icon: 'el-icon-circle-close',
                    handler: function (tab, item) {
                        app.handleTabsEdit(tab.id, 'remove');
                    }
                }, {
                    text: getLanuage('Close other'),
                    icon: 'far fa-copy',
                    handler: function (tab) {
                        app.tabs.forEach(item => {
                            if (item.id != tab.id) {
                                app.handleTabsEdit(item.id, 'remove');
                            }
                        })
                    }
                }, {
                    text: getLanuage('Close all'),
                    icon: 'el-icon-close',
                    handler: function (tab, item) {

                        app.$confirm(Lanuages["Are you sure you want them all closed"], Lanuages.Tips, {
                            confirmButtonText: Lanuages.ConfirmYes,
                            cancelButtonText: Lanuages.ConfirmNo,
                            type: 'warning'
                        }).then(function () {
                            app.tabs.forEach((tab, index) => {
                                if (index != 0) {
                                    app.handleTabsEdit(tab.id, 'remove');
                                }
                            });
                            app.menuActive = '1';
                        }).catch(function () {

                        });

                    }
                }, {
                    text: getLanuage('Open in a new page'),
                    icon: 'el-icon-news',
                    handler: function (tab, item) {
                        window.open(tab.newUrl);
                    }
                }]
            },
            //菜单里面的模块
            models: [],
            dialogVisible: false,  // Whether the dialog is visible or not
            dialogTabModel: '',    // Current active tab in the dialog view
            fontDialogVisible: false,
            fontSlider: 12,
            loading: false,
            menuTextShow: true,
            menuData: []
        },
        
        mounted() {
         
            // إنشاء مراقب التداخل
            // this.setupObserver();
            // استرجاع التبويب النشط من `sessionStorage`
            this.handleNestedDialogs();
    if (sessionStorage.getItem('activeTab')) {
        this.tabModel = sessionStorage.getItem('activeTab');
        console.log("this.tabModel", this.tabModel);
        console.log("this.tabModel", this.tabModel);


        // تحويل `tabModel` إلى رقم للمقارنة الصحيحة
        var activeTab = this.tabs.find(tab => tab.eid === parseInt(this.tabModel));
        
        if (activeTab) {
            console.log("this.activeTab", activeTab);

            this.openTab(activeTab);
        } else {
            console.log("Active tab not found!");
        }
        // عند تحميل المكون، استرجاع الرابط من مكان ما (مثلاً من URL)
        const url = window.location.href; // أو أي مصدر آخر للرابط
        console.log("menu",this.menus)
        console.log("generateBreadcrumbs",url)
        this.generateBreadcrumbs(url);
        this.updateBreadcrumbs();
    }

          },
          computed: {
            activeBreadcrumbs() {
                const tab = this.tabs.find(tab => tab.id === this.tabModel);
                console.log(tab ? tab.breadcrumbs : [])
                return tab ? tab.breadcrumbs : [];
            },
            currentTab() {
                return this.tabs.find(tab => tab.id === this.tabModel) || {};
            }
        },
        beforeDestroy() {
          // إزالة مستمع لاختصار لوحة المفاتيح عند تدمير المكون
          window.removeEventListener('keydown', this.handleKeydown);
        },
      

        watch: {
          
            theme: function (newValue, oldValue) {
                this.$nextTick(function () {
                    if (window.renderCallback) {
                        window.renderCallback(this);
                    }
                });
            },
            fold: function (newValue, oldValue) {
                // console.log(newValue)
            },
            menus: function (newValue, oldValue) {
                var self = this;

                newValue.forEach(item => {
                    if (item.id == '0') {
                        return;
                    }

                    let models = [];

                    function deep(menus) {
                        menus.forEach(item => {
                            //这是首页，不显示
                            if (item.eid === "1") {
                                return;
                            }

                            if (item.models) {
                                deep(item.models);
                            } else {
                                //没有子级的时候，才加入到首页菜单中去
                                models.push(item);
                            }

                        })

                    }

                    deep(newValue);

                    self.models = models;

                });
            }
            /*,
            tabs: function (newValue, oldValue) {

                //改变tab时把状态储存到sessionStorage
                console.log(newValue)
            }*/
        },
        created: function () {

            // this.watch.theme('');
            window.addEventListener('keydown', this.handleKeydown);

            var val = getCookie('fold') == 'true';
            this.small = this.fold = val;
            this.menuTextShow = !this.fold;

            var self = this;
            window.onresize = function () {

                self.height = document.documentElement.clientHeight || document.body.clientHeight
                var width = document.documentElement.clientWidth || document.body.clientWidth;

                if (!self.small) {

                    self.menuTextShow = !(width < 800);
                    self.$nextTick(() => {
                        self.fold = width < 800;
                    })
                }
                self.isResize = true;
                self.mobile = width < 800;

                //判断全屏状态
                try {
                    self.zoom = document.webkitIsFullScreen;
                } catch (e) {
                    //不是非webkit内核下，无能为力
                }
            }
            window.app = this;


            menus = this.handlerMenus(menus);
            this.menus = window.menus

            this.theme = getCookie('theme');
            this.themeName = getCookie('theme_name');


            //接收子页面的事件注册
            window.themeEvents = [];
            window.fontEvents = [];
            window.addEvent = function (name, handler) {
                if (name == 'theme') {
                    themeEvents.push(handler);
                } else if (name == 'font') {
                    fontEvents.push(handler);
                }
            }
            var temp_tabs = sessionStorage['tabs'];

            if (temp_tabs && temp_tabs != '') {
                this.tabs = JSON.parse(temp_tabs);
            }
            if (location.hash != '') {
                openByHash();
            }

            //elementui布局问题，导致页面不能正常撑开，调用resize使其重新计算
            if (window.onresize) {
                window.onresize();
            }
            this.$nextTick(function () {
                if (window.renderCallback) {
                    window.renderCallback(this);
                }
            });
            const currentUrl = window.location.href;
            this.openByHash()
            this.openTabByUrl(currentUrl);
            window.addEventListener('message', (event) => {
              if (event.origin !== 'http://127.0.0.1:8000') {
                  return;
              }
              const message = event.data;
              if (message.type === 'open-dialog') {
                if (event.data.type === 'open-dialog') {
                  this.openDialog1(event.data.options);
              }
                  // this.dialogSettings = { ...this.dialogSettings, ...message.options, visible: true };
              } else if (message.type === 'update-dialog-size') {
                  this.dialogSettings.width = `${message.width}px`;
                  this.dialogSettings.height = `${message.height}px`;
              }
          });
        },
        watch: {
            tabs: 'setupObservers'
          }
,        
        watch: {
            
            'dialogConfig.show'(newValue) {
              if (newValue) {
                this.adjustIframeHeight();
              }
            },
            dialogConfig: {
              handler() {
                this.calculateDialogSize();
              },
              deep: true
            }
          },
          beforeDestroy() {
            // تأكد من فصل المراقبة عندما يتم تدمير المكون
            if (this.resizeObserver) {
              this.resizeObserver.disconnect();
            }
          },
        methods: {
          sendSizeRequestToIframe() {
            // Ensure iframe is ready and send request for its size
            const iframe = this.$el.querySelector('iframe');
            if (iframe) {
                iframe.contentWindow.postMessage({ type: 'request-size' }, '*');
            }
        },
          openDialog1(options) {
            Object.assign(this.dialogSettings, options);
            this.dialogSettings.visible = true;
        },
        handleClose(done) {
            done();
        },
        handleFooterButtonClick(action) {
            if (action === 'cancel') {
                this.dialogSettings.visible = false;
            } else if (action === 'save') {
                // Save action logic here
            }
        },
          saveUsageData(menuItemId, usageData) {
            let usageDataStorage = JSON.parse(localStorage.getItem('usageData')) || {};
            usageDataStorage[menuItemId] = usageData;
            localStorage.setItem('usageData', JSON.stringify(usageDataStorage));
          },
      
          // Main function to handle and process the menu data
          handlerMenus(menus) {
            let self = this;
            // Recursively process each menu item
            menus.forEach(item => {
              item.icon = self.getIcon(item.name, item.icon);
      
              if (item.models) {
                item.models.forEach(mItem => {
                  mItem.icon = self.getIcon(mItem.name, mItem.icon);
                  self.menuData.push(mItem);
                  if (mItem.models) {
                    self.handlerMenus(mItem.models);
                  }
                });
              } else {
                self.menuData.push(item);
              }
            });
      
            // Retrieve usage data from localStorage
            let usageDataStorage = JSON.parse(localStorage.getItem('usageData')) || {};
            // Update each menu item's usage data
            self.menuData.forEach(item => {
              let usageData = usageDataStorage[item.id] || { count: 0, lastUsed: 0 };
              item.usageCount = usageData.count;
              item.lastUsed = usageData.lastUsed;
            });
      
            // Sort menu items based on usage data
            self.menuData.sort((a, b) => {
              // Prioritize by usage count and then by last used time
              if (a.usageCount !== b.usageCount) {
                return b.usageCount - a.usageCount;  // Higher usage count comes first
              }
              return b.lastUsed - a.lastUsed;  // More recent last used time comes first
            });
            // Update usage data after sorting
            self.menuData.forEach(item => {
              let usageData = {
                count: (item.usageCount || 0) + 1,  // Increment usage count
                lastUsed: Date.now()  // Update last used time to the current time
              };
              self.saveUsageData(item.eid, usageData);
            });
      
            return menus;
          }
        ,
            openByHashs() {
                // Get the hash from the URL and clean it up
                console.log("hash = ", location.hash.substring(2));
                let hash = location.hash;

    // إزالة # من بداية الهاش
    let path = hash ? hash.substring(1) : '';

    // تحقق مما إذا كان يحتوي على /admin
    let hasAdminPath = path.includes('/admin');

    // إخراج النتيجة
    if (hasAdminPath) {
        console.log('الهاش يحتوي على /admin');
    } else {
        path = '/admin' + path;

    }
    
                // Split hash into URL path and query parameters for breadcrumbs
                let [urlPath, breadcrumbsParam] = path.split('?');
                let breadcrumbs = breadcrumbsParam ? JSON.parse(decodeURIComponent(breadcrumbsParam)) : [];
    
                // Find the menu item based on the URL path
                console.log("item",path)
                let item = this.menuData.filter(item => item.url === urlPath);
                item=item[0]
                item.id=item.eid;
                changeUrl(item);

                console.log("item",item)
                if (item) {
                    // Open the tab
                    this.openTab(item);
    
                    // Update breadcrumbs in Vue instance
                    this.breadcrumbs = breadcrumbs;
                } else {
                    console.warn('Menu item not found for URL:', urlPath);
                }
            },
        
            extractTabIdFromUrl(url) {
                try {
                  const parsedUrl = new URL(url, window.location.origin);
                  let path = parsedUrl.hash ? parsedUrl.hash.replace('#/', '') : parsedUrl.pathname.replace(/^\//, '');
                  cons
                  path = path.split('?')[0];
                  const tabId = path.split('/').pop(); // استخلاص آخر جزء من المسار كمعرّف للتبويب
                  return tabId || null;
                } catch (error) {
                  console.error('Error extracting tab ID from URL:', error);
                  return null;
                }
              },
            
              openTabByUrl(url) {
                  const tabId = this.extractTabIdFromUrl(url);
                if (tabId) {
                  const tab = this.tabs.find(t => t.id === tabId);
                  if (tab) {
                    this.tabModel = tab.id;
                    this.openTab(tab);
                  } else {
                    console.warn('Tab not found:', tabId);
                  }
                } else {
                  console.warn('Invalid URL or no tab ID found');
                }
              },
            generateBreadcrumbs(url) {
                // استخرج جزء من URL أو معرّف التبويب من الرابط
                const path = this.extractTabIdFromUrl(url);
                
                // العثور على التبويب المناسب بناءً على الـ tabId
                console.log("sss",path)
                const tab = this.tabs.find(tab => tab.url===path);
                // التحقق من وجود التبويب
                if (tab && tab.breadcrumbs) {
                    this.breadcrumbs = tab.breadcrumbs;
                } else {
                    this.breadcrumbs = [];
                }
            },
            extractTabIdFromUrl(url) {
                try {
                  // تحليل الـ URL
                  const parsedUrl = new URL(url, window.location.origin);
                  console.log("teeeeeee",parsedUrl)

                  // الحصول على المسار بناءً على وجود هاش (#) أو عدمه
                  let path = parsedUrl.hash ? parsedUrl.hash.replace('#/', '') : parsedUrl.pathname.replace(/^\//, '');
            
                  // تنظيف المسار لإزالة أي بارامترات إضافية (مثل؟)
                  path = path.split('?')[0];
                  
                  // استخراج معرّف التبويب بناءً على هيكل المسار
                  const tabId = path.split('/').pop(); // استخراج آخر جزء من المسار كمعرّف للتبويب
            
                  return tabId || null;
                } catch (error) {
                  console.error('Error extracting tab ID from URL:', error);
                  return null;
                }},
            navigateToTab(tabId) {
                const tab = this.tabs.find(t => t.id === tabId);
                if (tab) {
                    this.tabModel = tab.id;
                    this.updateBreadcrumbs();
                }
            },
            updateBreadcrumbs() {
                // تحديث الـ breadcrumbs بناءً على التبويب النشط
                const tab = this.tabs.find(tab => tab.id === this.tabModel);
                this.breadcrumbs = tab ? tab.breadcrumbs : [];
            },
            initializeObserver() {
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const iframe = entry.target;
                      iframe.src = iframe.getAttribute('data-src');
                      observer.unobserve(iframe);
                    }
                  });
                });
        
                this.$nextTick(() => {
                  this.$el.querySelectorAll('iframe').forEach(iframe => {
                    observer.observe(iframe);
                  });
                });
              },
                // تحقق من جاهزية المحتوى داخل الـiframe
                // تحقق من جاهزية المحتوى داخل الـiframe
              
                checkContentReady() {
        const iframe = this.$refs.contentIframe;
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // تأخير التحقق قليلاً للتأكد من جاهزية المحتوى
        setTimeout(() => {
            // التحقق من جاهزية المحتوى بناءً على وجود عناصر
            const forms = iframeDocument.querySelectorAll('form');
            const tables = iframeDocument.querySelectorAll('table');

            let isContentReady = false;

            if (forms.length > 0) {
                isContentReady = Array.from(forms).every(form => form.querySelectorAll('input, select, textarea').length > 0);
            }

            if (tables.length > 0) {
                isContentReady = Array.from(tables).every(table => table.querySelectorAll('tr').length > 0);
            }

            // التحقق من أن المحتوى جاهز
            if (isContentReady) {
                this.calculateDialogSize(); // حساب حجم الدايلوج بناءً على المحتوى
                this.loading = false; // إيقاف عرض مؤشر التحميل
                this.dialogConfig.show = true; // عرض الدايلوج بعد التأكد من جاهزية المحتوى
            } else {
                // إعادة محاولة التحقق بعد فترة زمنية قصيرة إذا لم يكن المحتوى جاهزاً بعد
                this.checkContentReady();
            }
        }, 500); // تأخير بمقدار 500 مللي ثانية
    },

    // حساب حجم الـdialog بناءً على حجم المحتوى
    calculateDialogSize() {
        const iframe = this.$refs.contentIframe;
        if(iframe){
          
          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      

        // الحصول على أبعاد المحتوى داخل الـiframe
        const contentHeight = iframeDocument.body.scrollHeight;
        const contentWidth = iframeDocument.body.scrollWidth;
        // حساب حجم العناصر الداخلية للـdialog
        const dialog = this.$el.querySelector('#erp-flex');
        const dialogElement = dialog.querySelector('.el-dialog');
        const dialogHeader = dialogElement.querySelector('.el-dialog__header');
        const dialogBody = dialogElement.querySelector('.el-dialog__body');

        const headerHeight = dialogHeader ? dialogHeader.offsetHeight : 0;
        const bodyPadding = dialogBody ? (
            parseInt(window.getComputedStyle(dialogBody).paddingTop) +
            parseInt(window.getComputedStyle(dialogBody).paddingBottom)
        ) : 0;
        console.log("contentHeight",headerHeight)

        // حساب الارتفاع الكلي
        const totalHeight = contentHeight + headerHeight 

        const dialogWidth =contentWidth + 'px'; // إضافة هامش وتحديد حد أدنى
        const dialogHeight = totalHeight + 'px'; // إضافة هامش وتحديد حد أدنى

        // تحديث أبعاد الـdialog
        if (dialogElement) {
            console.log("dialogElement",dialogElement)
            dialogElement.style.setProperty("width",dialogWidth,"important");
            dialogElement.style.setProperty("height",dialogHeight,"important");
        }  }
    }
            ,
            
              calculateTotalContentHeight(doc) {
                let totalHeight = 0;
          
                // الحصول على جميع الأقسام داخل الـ iframe
                const sections = doc.querySelectorAll('section, div, table, form');
          
                // جمع ارتفاع كل قسم
                sections.forEach(section => {
                  totalHeight += section.scrollHeight;
                });
          
                return totalHeight;
              },
              calculateTotalContentWidth(doc) {
                let maxWidth = 0;
          
                // الحصول على جميع الأقسام داخل الـ iframe
                const sections = doc.querySelectorAll('section, div, table, form');
          
                // العثور على أوسع قسم
                sections.forEach(section => {
                  maxWidth = Math.max(maxWidth, section.scrollWidth);
                });
          
                return maxWidth;




            },
      
            onIframeLoad() {
              this.checkContentReady();
            },
            handleClose(done) {
              this.dialogConfig.show = false;
              done();
            },
        
    openContentDialog(url) {
        this.dialogConfig.url = url;
        this.loading = true;
        this.dialogConfig.show = false;
        this.$nextTick(() => {
          this.checkContentReady(); // التأكد من جاهزية المحتوى
        });
      },





                  handleSave() {
                    this.dialogConfig.show = false;
                    this.$message({
                      message: 'تم الحفظ بنجاح!',
                      type: 'success'
                    });
                  },
                  handleCancel() {
                    this.dialogConfig.show = false;
                  },
                  closeDialog() {
                    this.dialogConfig.show = false;
                    this.loading = true;
                   /*  if (this.resizeObserver) {
                      this.resizeObserver.disconnect(); // تأكد من إيقاف المراقبة عند غلق الدايلوج
                    } */
                  },
            setupObserver() {
                this.observer = new IntersectionObserver((entries) => {
                  entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                      this.loadIframe(entry.target);
                      this.observer.unobserve(entry.target);
                    }
                  });
                });
              },
            loadIframe(iframe) {
                iframe.src = iframe.dataset.src;
              },
          
       
            adjustIframeHeight() {
                this.$nextTick(() => {
                  const iframe = this.$refs.pwdIframe;
                  if (iframe) {
                    iframe.addEventListener('load', () => {
                      const childElement = iframe.contentWindow.document.getElementById('changelist-form')||iframe.contentWindow.document.getElementById('content');
                      if (childElement) {
                        this.iframeHeight = childElement.scrollHeight;
                        console.log(this.iframeHeight)
                      }
                    });
                  }
                });
              },
        
            syncTabs: function () {
                if (window.sessionStorage) {
                    sessionStorage['tabs'] = JSON.stringify(this.tabs);
                    sessionStorage['activeTab'] = this.tabModel; // حفظ `tabModel` عند تحديثه
                }
            },
            reset: function () {
                this.fontSlider = 14;
                fontConfig.fontSize = 0;

                setCookie('fontSize', 0);

                this.fontDialogVisible = false;
                fontEvents.forEach(handler => {
                    handler(0);
                });
            },
            fontClick: function () {
                this.fontSlider = fontConfig.fontSize;
                this.fontDialogVisible = !this.fontDialogVisible;
            },
            fontSlideChange: function (value) {
                fontConfig.fontSize = value;
                //写入cookie
                setCookie('fontSize', value);
                fontEvents.forEach(handler => {
                    handler(value);
                });

            },
            iframeLoad(tab, e) {
                const url = e.target.contentWindow.location.href;
                const iframe = e.target;
        
                tab.newUrl = url;
                tab.loading = false;
                this.$forceUpdate();
        
                e.target.contentWindow.beforeLoad = () => {
                  tab.loading = true;
                  this.$forceUpdate();
                };
                this.loading = false;
              },
              handleNestedDialogs() {
                const dialogElements = document.querySelectorAll('.el-dialog');
                dialogElements.forEach((dialog, index) => {
                  dialog.style.zIndex = 2000 + index; // تعيين ز-أعلى بناءً على ترتيب النوافذ المنبثقة
                });
              },
               // معالجة الـ URL وتحديث البريد كرمب والتبويبات
    handleUrl(url) {
        let hash = location.hash;

        // إزالة # من بداية الهاش
        let path = hash ? hash.substring(1) : '';
    
        // تحقق مما إذا كان يحتوي على /admin
       
        
        path = this.ensureAdminPath(path);

        // البحث عن التبويب في البيانات وتحديث البريد كرمب
        let tab = this.tabs.filter(tab => tab.url && path.includes(tab.url));
        console.log("path",tab)

        if (tab&&tab.length>0) {
            tab=tab[0]
          this.openTab(tab, null, true, false);
          this.updateBreadcrumbs(tab);
        } else {
            let item = this.menuData.filter(item => item.url === path);
            item=item[0]
            item.id=item.eid;
            this.openTab(item);
        }
      },
  
      // التحقق من وجود /admin في المسار
      ensureAdminPath(path) {
        if (!path.startsWith('/admin')) {
          path = '/admin' + path;
        }
        return path;
      },
  
      // فتح التبويب بناءً على البيانات
      openByHash() {
        
        const hash =location.hash
        this.handleUrl(hash);
      },
  
      // تحديث البريد كرمب بناءً على التبويب
      updateBreadcrumbs(tab) {
        this.breadcrumbs = tab.breadcrumbs || [];
        console.log('تحديث البريد كرمب:', this.breadcrumbs);
      },

    // تعيين eid إذا لم يكن موجودًا
    assignEid(data) {
        if (!data.eid) {
          data.eid = new Date().getTime() + "" + Math.random();
        }
      },
  
      // تعيين التبويب النشط
      setMenuActive(index) {
        if (index) {
          this.menuActive = String(index);
        }
      },
  
      // اختيار التبويب المحدد
      selectTab(data) {
        for (let i = 0; i < this.tabs.length; i++) {
          if (this.tabs[i].url === data.url) {
            this.tabModel = this.tabs[i].id;
            this.updateTabUsage(this.tabs[i].id);
            break;
          }
        }
      },
  
      // العثور على التبويب أو إنشاء تبويب جديد
      findOrCreateTab(data) {
        let exists = null;
        for (let i = 0; i < this.tabs.length; i++) {
          const tab = this.tabs[i];
          if (tab.eid === data.eid) {
            exists = tab;
            continue;
          }
        }
  
        if (exists) {
          this.tabModel = exists.id;
          this.updateTabUsage(exists.id);
        } else {
          data.id = data.eid;
          this.manageTabLimit();

          this.tabs.push(data);
          this.tabModel = data.id;
        }
      },
  
      // تحديث استخدام التبويب
      updateTabUsage(tabId) {
        if (this.tabUsage[tabId]) {
          this.tabUsage[tabId]++;
        } else {
          this.tabUsage[tabId] = 1;
        }
      },
  
      // إدارة عدد التبويبات وحذف الأقل استخدامًا إذا لزم الأمر
      manageTabLimit() {
        if (this.tabs.length > 10) {
          const sortedTabs = this.tabs.slice().sort((a, b) => {
            return (this.tabUsage[a.id] || 0) - (this.tabUsage[b.id] || 0);
          });
  
          const leastUsedTab = sortedTabs[0];
 
          // إشعار للمستخدم
          this.$confirm(
            `عدد التبويبات قد تجاوز الحد المسموح به. يجب حذف التبويبات الأقل استخدامًا قبل إضافة تبويب جديد. 
            هل تريد الانتقال إلى التبويب الأقل استخدامًا (${leastUsedTab.name}) لحذفه؟`,
            'تنبيه',
            {
              confirmButtonText: 'نعم',
              cancelButtonText: 'لا',
              type: 'warning'
            }
          ).then(() => {
            // الانتقال إلى التبويب الأقل استخدامًا
            this.tabModel = leastUsedTab.id;
            this.updateTabUsage(leastUsedTab.id);
            this.tabs = this.tabs.filter(tab => tab.id !== leastUsedTab.id);
            delete this.tabUsage[leastUsedTab.id];
            this.manageTabLimit(); // إعادة التحقق من الحد بعد حذف التبويب
          }).catch(() => {
            // لا تفعل أي شيء إذا اختار المستخدم عدم حذف التبويب
          });
        }
      },
      openInNewTab(url) {
        window.open(url);
      },
   // دالة رئيسية لفتح التبويب
   openTabs(data, index, selected, loading) {
    if (data.newTab) {
      this.openInNewTab(data.url);
      return;
    }

    this.assignEid(data);
    this.setMenuActive(index);

    if (selected) {
      this.selectTab(data);
      return;
    }

    this.findOrCreateTab(data);
    this.syncTabs();
    changeUrl(data);
  },
  openTab(data, index, selected, loading) {
    if (data.newTab) {
      window.open(data.url);
      return;
    }

    if (!data.eid) {
      data.eid = new Date().getTime() + "" + Math.random();
    }

    if (index) {
      this.menuActive = String(index);
    }

    if (selected) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].url === data.url) {
          this.tabModel = this.tabs[i].id;
          break;
        }
      }
      return;
    }

    let exists = null;
    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i];
      if (tab.eid === data.eid) {
        exists = tab;
        continue;
      }
    }

    if (exists) {
      this.tabModel = exists.id;
      exists.lastUsed = new Date().getTime();
      exists.usageCount = (exists.usageCount || 0) + 1;
    } else {
      data.id = data.eid;
      data.lastUsed = new Date().getTime();
      data.usageCount = 1;
      this.tabs.push(data);
      this.tabModel = data.id;
    }

    this.tabs.sort((a, b) => {
      if (a.usageCount !== b.usageCount) {
        return b.usageCount - a.usageCount;
      }
      return b.lastUsed - a.lastUsed;
    });
    let dialogId = `dialog-${data.id}`;

    // Check if a dialog for this tab already exists
    if (!this.dialogs.some(dialog => dialog.id === dialogId)) {
        // Create a new dialog entry
        this.dialogs.push({
            id: dialogId,
            title: data.name,
            url: data.url,
            visible: true,
            loading: loading,
        });
    } else {
        // If the dialog already exists, just show it
        let dialog = this.dialogs.find(dialog => dialog.id === dialogId);
        dialog.visible = true;
    }

    this.syncTabs();
    changeUrl(data);

    if (this.dialogVisible) {
      this.dialogVisible = false;  // Close the dialog if a tab is selected
    }
  },
  closeDialog(dialogId) {
    let dialog = this.dialogs.find(dialog => dialog.id === dialogId);
    if (dialog) {
        dialog.visible = false;
    }
},
handleKeydown(event) {
  // Check if the pressed keys are Ctrl + Shift + T
  if (event.altKey && event.key === 'Z') {
    this.openAllTabsInDialogs();
  }
},

openAllTabsInDialogs() {
  const dialogWidth = 600; // عرض النافذة
  const dialogHeight = 400; // ارتفاع النافذة
  const offset = 30; // المسافة بين النوافذ

  this.tabs.forEach((tab, index) => {
      let dialogId = `dialog-${tab.id}`;
      let x = (index % 3) * (dialogWidth + offset); // حساب موقع x
      let y = Math.floor(index / 3) * (dialogHeight + offset); // حساب موقع y

      if (!this.dialogs.some(dialog => dialog.id === dialogId)) {
          this.dialogs.push({
              id: dialogId,
              title: tab.name,
              url: tab.url,
              visible: true,
              loading: false,
              style: {
                left: `${x+50}px`,
                width: "350px",
                height: "350px",
                right: `auto`,
                flex: '0 0 auto',         /* منع العناصر من التمدد أو الانكماش */
                width: '300px',           /* عرض العنصر، يمكنك تغييره حسب الحاجة */
                height: '300px',          /* ارتفاع العنصر، يمكنك تغييره حسب الحاجة */
                backgroundColor: '#f0f0f0', /* لون خلفية العنصر */
                border: '1px solid #ccc', /* حدود العنصر */
                display: 'flex',          /* استخدام Flexbox لتوسيع المحتوى داخل العنصر */
                alignItems: 'center',    /* محاذاة المحتوى عمودياً */
                justifyContent: 'center',/* محاذاة المحتوى أفقياً */
                boxSizing: 'border-box',  /* يشمل الحشوة والحدود في العرض والارتفاع */
            
                  right: `${x+18}px`,
                  position: 'absolute'
              }
          });
      } else {
          let dialog = this.dialogs.find(dialog => dialog.id === dialogId);
          dialog.visible = true;
          dialog.style = {
              left: `${x+50}px`,
              right: `auto`,
              top: `${10}px`,
              position: 'absolute'
          };
      }
  });
  this.dialogVisible = true;  // Close the dialog
},

openDialog(tab) {
  // إغلاق نافذة اختيار التبويب
  this.dialogVisible = false;
  
  // فتح نافذة التبويب المحدد في نافذة التبويب الرئيسية
  this.openTab(tab);
},

closeDialog(id) {
  let dialog = this.dialogs.find(dialog => dialog.id === id);
  if (dialog) {
      dialog.visible = false;
  }
},

handleDialogClose() {
  // إغلاق جميع الحوارات عند إغلاق نافذة الاختيار الرئيسية
  this.dialogs.forEach(dialog => {
      dialog.visible = false;
  });
},
  handleDialogTabClick(tab) {
    const selectedTab = this.tabs.find(t => t.id === tab.name);
    if (selectedTab) {
      this.openTab(selectedTab);
      this.dialogVisible = false;  // Close the dialog
    }
  },

  handleDialogClose() {
    this.dialogVisible = false;
  },

  
            setTheme: function (item) {
                var url = window.themeUrl;
                if (item.file && item.file != '') {
                    this.theme = url + item.file;
                } else {
                    this.theme = '';
                }
                this.themeName = item.text;
                setCookie('theme', this.theme);
                setCookie('theme_name', item.text);

                var self = this;
                //通知子页面
                window.themeEvents.forEach(handler => {
                    handler(self.theme)
                });
            },
            openUrl: function (url) {
                window.open(url);
            },
            contextmenu: function (item, e) {
                //右键菜单，如果x+菜单宽度超过屏幕宽度，就默认为屏幕宽度-10-菜单宽度

                //home没有popup menu
                if (item.id == '0') {
                    return;
                }
                this.popup.tab = item;
                this.popup.show = true;
                this.$nextTick(function () {
                    let el = this.$refs.popupmenu;
                    el.style.width = '150px';
                    let x = e.clientX;

                    let w = document.body.offsetWidth
                    if (x + 150 > w) {
                        x = w - 160;
                    }

                    this.popup.left = x;
                    this.popup.top = e.clientY;
                });
            },
            mainClick: function (e) {
                this.popup.show = false;
            },  updateBreadcrumbs() {
                const tab = this.tabs.find(tab => tab.id === this.tabModel);
                this.breadcrumbs = tab ? tab.breadcrumbs : [];
            },
            tabClick: function (tab) {
                var item = this.tabs[tab.index];
                var index = item.index;
                this.menuActive = String(index);
                this.breadcrumbs = item.breadcrumbs;
                if (tab.index == '0') {
                    item.url = '/'
                }
                changeUrl(item);
                sessionStorage['activeTab'] = tab.index;
                this.updateBreadcrumbs();


            },
            handleTabsEdit: function (targetName, action) {

                var self = this;
                if (action === 'remove') {
                    var next = '0';
                    this.tabs.forEach((tab, index) => {
                        if (tab.id == targetName) {
                            var temp = self.tabs[index + 1] || self.tabs[index - 1];
                            if (temp) {
                                next = temp.id;
                                self.menuActive = temp.index;
                                self.breadcrumbs = temp.breadcrumbs;
                                changeUrl(temp)
                            }
                        }
                    });
                    this.tabModel = next;

                    if (targetName != 0) {
                        this.tabs = this.tabs.filter(tab => tab.id !== targetName);
                    }
                    this.syncTabs();
                }
            }
            
          
            ,
            foldClick: function () {

                //移动端浮动菜单
                var width = document.documentElement.clientWidth || document.body.clientWidth;
                if (width < 800) {
                    this.drawer = !this.drawer;
                    return;
                }
                this.menuTextShow = !this.menuTextShow;
                this.$nextTick(() => {
                    this.fold = !this.fold;

                    this.small = this.fold;
                    //设置进cookie
                    setCookie('fold', this.fold);
                });


            }
            ,
            openDialog(url, name, customClass = '', dialogWidth = '70vw', dialogHeight = '70vh' ) {
              const viewportWidth = document.documentElement.clientWidth || document.body.clientWidth;
  console.log("url",url)
              if (viewportWidth > 800) {
                  // For larger viewports, configure the dialog
                  this.dialogConfig = {
                      url,
                      name,
                      show: true,
                      customClass,
                      dialogWidth,
                      dialogHeight
                  };
              } else {
                  // For smaller viewports, handle differently (e.g., open in a tab)
                  this.openInTab({ url, name });
              }
  
              // Ensure that the dialog adjusts its size based on content readiness
              this.$nextTick(() => {
                  if (this.dialogConfig.show) {
                      this.checkContentReady();
                  }
              });
          },
            changePassword: function () {
                var width = document.documentElement.clientWidth || document.body.clientWidth;
                
                if (width > 800) {
                    this.dialogConfig = {
                        url: "/admin/polls/profile/add/",
                        name: language.change_password,
                        show: true
                    };

                } else {
                    this.openTab({
                        url: window.urls.changePassword,
                        icon: 'far fa-edit',
                        name: language.change_password,
                        breadcrumbs: [{
                            name: language.change_password,
                            icon: 'far fa-edit'
                        }]
                    })
                    app.breadcrumbs = [language.change_password];
                }
                this.$nextTick(() => {
                    this.checkContentReady();
                  });
            }
            ,
            logout: function () {
                this.$confirm(language.confirm, Lanuages.Tips, {
                    confirmButtonText: language.yes,
                    cancelButtonText: language.no,
                    type: 'warning'
                }).then(function () {
                    //清除cookie主题设置和sessionStore数据
                    delete sessionStorage['tabs'];
                    setCookie('theme', '');
                    setCookie('theme_name', '');

                    //创建一个form post方式提交
                    document.querySelector("#logout_form").submit();
                    // window.location.href = window.urls.logout;
                }).catch(function () {

                });
            }
            ,
            goIndex: function (url) {
                if (!url || url == 'None') {
                    url = '/';
                }
                window.open(url);
            }
            ,
            getLanuage: getLanuage,
            getIcon: getIcon,
            goZoom: function () {
                var el = window.document.body;
                if (!this.zoom) {

                    var isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    if (!isFullscreen) {//进入全屏,多重短路表达式
                        (el.requestFullscreen && el.requestFullscreen()) ||
                        (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
                        (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el.msRequestFullscreen && el.msRequestFullscreen());
                    }
                    this.zoom = true;
                } else {

                    document.exitFullscreen ? document.exitFullscreen() :
                        document.mozCancelFullScreen ? document.mozCancelFullScreen() :
                            document.webkitExitFullscreen ? document.webkitExitFullscreen() : '';
                    this.zoom = false;
                }
            }
            ,
            displayTimeline: function () {
                this.timeline = !this.timeline;
            },
            report: function (url) {
                if (!url) {
                    if (document.querySelector('html').lang) {
                        url = 'https://simpleui.72wo.com';
                    } else {
                        url = 'https://github.com/newpanjing/simpleui/issues';
                    }
                }
                window.open(url);
            }
        }
    })


})();