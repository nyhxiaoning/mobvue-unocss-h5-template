<template>
    <div class="city-view">
        <!-- 顶部导航栏 -->

        <!-- 搜索框 -->
        <div class="search-wrapper">
            <van-search v-model="searchText" :placeholder="language.searchPlaceholder" shape="round" :clearable="true"
                :show-left-icon="false" autocomplete="off" @focus="onSearchFocus" @blur="onSearchBlur" @input="onSearch"
                @clear="onClear" />

            <!-- 搜索联想结果 -->
            <div v-show="isSearchFocused && searchResults.length > 0" class="search-suggestions">
                <div v-for="city in searchResults" :key="city.name" class="suggestion-item" @click="selectCity(city)">
                    {{ city.name }}
                </div>
            </div>
        </div>

        <!-- 主内容区域 -->
        <div class="main-container">
            <!-- 左侧边栏 -->
            <div class="sidebar">
                <div class="sidebar-container">
                    <!-- 基础灰色背景 -->
                    <div class="sidebar-background"></div>

                    <!-- 选中状态的白色分割线 -->
                    <div v-if="selectedContinent" class="sidebar-divider" :style="{ top: `${getSelectedIndex() * 60}px` }">
                    </div>

                    <!-- 州列表 -->
                    <div v-for="continent in continents" :key="continent.key" class="sidebar-item"
                        :class="{ active: selectedContinent === continent.key }" @click="selectContinent(continent.key)">
                        {{ languageFlag ? continent.name : continent.key }}
                    </div>
                </div>
            </div>

            <!-- 右侧内容区域 -->
            <div class="content-area">
                <!-- 城市列表区域 -->
                <div class="city-list-container">
                    <div v-for="region in filteredRegions" :key="region.name" class="region-section">
                        <van-cell :title="region.name" is-link
                            :arrow-direction="expandedRegions[region.name] ? 'up' : 'down'"
                            @click="toggleRegion(region.name)" class="region-header">
                            <template #right-icon>
                                <span class="more-text">{{ languageFlag ? '更多' : 'More' }}</span>
                                <van-icon :name="expandedRegions[region.nameEn] ? 'arrow-up' : 'arrow-down'" />
                            </template>
                        </van-cell>

                        <div class="city-grid"
                            :class="{ expanded: languageFlag ? expandedRegions[region.name] : expandedRegions[region.nameEn] }">
                            <van-button v-for="city in expandedRegions[region.name]
                                ? region.cities
                                : region.cities.slice(0, 6)" :key="city"
                                :class="{ selected: selectedCity === city }" size="small" @click="selectCity(city)">
                                {{ languageFlag ? city.name : city.nameEn }}
                            </van-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
// import { useStore } from 'vuex';


import { useUserStore } from './../store/index';
import pinyin from 'pinyin-match';
import { Icon as VanIcon, NavBar, Search, Cell, Button, showToast } from 'vant';

/**
 * data：国家地区总数据
 */

import chinaData from './../utils/中国.json';
import GermanData from './../utils/德国.json';
import FrenchData from './../utils/法国.json';
import CanadaData from './../utils/加拿大.json';
import UsaData from './../utils/美国.json';
import UsData from './../utils/英国.json';
import AustraliaData from './../utils/澳大利亚.json';


const router = useRouter();
// const store = useUserStore();

// 替换模板中的组件名称
// const VanNavBar = NavBar;
const VanSearch = Search;
const VanCell = Cell;
const VanButton = Button;

const languageFlag = computed(() => {
    return JeeWeb.Language === 'zh-CN' ? true : false;
});

const searchText = ref('');
const selectedCity = ref('');
const selectedContinent = ref('asia');
const expandedRegions = ref({});
const isSearchFocused = ref(false);

const language = reactive({
    searchPlaceholder: JeeWeb.Language === 'zh-CN' ? '搜索城市' : 'Search City',
    more: JeeWeb.Language === 'zh-CN' ? '更多' : 'More',
    noContent: JeeWeb.Language === 'zh-CN' ? '暂无内容' : 'No Content',
    continents: {
        asia: JeeWeb.Language === 'zh-CN' ? '亚洲' : 'Asia',
        europe: JeeWeb.Language === 'zh-CN' ? '欧洲' : 'Europe',
        // namerica: JeeWeb.Language === 'zh-CN' ? '北美洲' : 'North America',
        // oceania: JeeWeb.Language === 'zh-CN' ? '大洋洲' : 'Oceania',
        // africa: JeeWeb.Language === 'zh-CN' ? '非洲' : 'Africa',
        // samerica: JeeWeb.Language === 'zh-CN' ? '南美洲' : 'South America',
        // antarctica: JeeWeb.Language === 'zh-CN' ? '南极洲' : 'Antarctica'
    }
});

// 获取洲列表
const continents = computed(() => [
    { key: 'asia', name: '亚洲' },
    { key: 'europe', name: '欧洲' },
    { key: 'namerica', name: '北美洲' },
    { key: 'oceania', name: '大洋洲' },
    // { key: 'africa', name: '非洲' },
    // { key: 'samerica', name: '南美洲' },
    // { key: 'antarctica', name: '南极洲' },
]);

// 获取选中州的索引
const getSelectedIndex = () => {
    return continents.value.findIndex((c) => c.key === selectedContinent.value);
};

// 模拟数据
const allRegions = {
    asia: [
        chinaData
    ],
    europe: [
        GermanData,
        FrenchData,
        UsData
    ],
    namerica: [
        UsaData,
        CanadaData
    ],
    oceania: [
        AustraliaData
    ]
};

// 获取当前大洲的区域
const currentRegions = computed(() => {
    return allRegions[selectedContinent.value] || [];
});

// 搜索过滤
const filteredRegions = computed(() => {
    if (!searchText.value) return currentRegions.value;

    return currentRegions.value
        .map((region) => ({
            ...region,
            cities: region.cities.filter(
                (city) =>
                    city.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
                    city.nameEn.toLowerCase().includes(searchText.value.toLowerCase()) ||
                    city.value.toLowerCase().includes(searchText.value.toLowerCase()),
            ),
        }))
        .filter((region) => region.cities.length > 0);
});

// 选择大洲
const selectContinent = (continentKey) => {
    selectedContinent.value = continentKey;
    selectedCity.value = '';
    // 重置搜索和展开状态
    searchText.value = '';
    expandedRegions.value = {};
};

// 切换区域展开状态
const toggleRegion = (regionName) => {

    expandedRegions.value[regionName] = !expandedRegions.value[regionName];
};

// 搜索结果
const searchResults = ref([]);

// 搜索处理
const onSearch = () => {
    if (!searchText.value) {
        searchResults.value = [];
        return;
    }

    const allCities = [];
    Object.values(allRegions).forEach((regions) => {
        regions.forEach((region) => {

            region.cities.forEach((city) => {
                allCities.push(city);
            });
        });
    });

    const searchQuery = searchText.value.toLowerCase();

    searchResults.value = allCities
        .filter((city) => {
            return (
                city.name.toLowerCase().includes(searchQuery) ||
                city.value.toLowerCase().includes(searchQuery) ||
                pinyin.match(city.name, searchQuery)
            );
        })
        .slice(0, 20);
    if (!searchResults.value.length) {
        showToast('暂无内容');
    }
    console.log('搜索结果')
    console.log(JSON.stringify(searchResults.value))

};

const onClear = () => {
    searchText.value = '';
};

// 选择城市
const selectCity = (city) => {

    // TODO:这里替换一下，如果下发成功，才会将这里的值放在store，不然首页错误更新
    sessionStorage.setItem('weathername', JeeWeb.Language === 'zh-CN' ? city.name : city.nameEn);
    sessionStorage.setItem('weathervalue', city.value);

    console.log('selectCity', city);
    router.push('weather');

    // selectedCity.value = city;
    // store.dispatch('updateCity', { name: city.name, value: city.value });
};

// 返回上一页
const goBack = () => {
    // router.back();
    router.push('/city');
};

// 搜索框焦点事件
const onSearchFocus = () => {
    isSearchFocused.value = true;
};

const onSearchBlur = () => {
    // 延迟隐藏搜索结果，以便能够点击结果
    setTimeout(() => {
        isSearchFocused.value = false;
    }, 200);
};
</script>

<style scoped>
.city-view {
    min-height: 100vh;
    background-color: #ffffff;
    /* padding-top: 46px;  */
    display: flex;
    flex-direction: column;
    position: relative;
}

.custom-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: #ffffff;
}

:deep(.van-nav-bar__title) {
    color: #000000;
    font-size: 18px;
    font-weight: 500;
}

:deep(.van-nav-bar .van-icon) {
    color: #000000;
}

.search-wrapper {
    padding: 12px 20px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1000;
}

:deep(.van-search) {
    padding: 0;
    background-color: transparent;
    width: 100%;
    margin: 0 auto;
}

:deep(.van-search__content) {
    background-color: #f5f5f5;
    border-radius: 8px;
    height: 50px;
    padding: 0 12px;
    display: flex;
    align-items: center;
}

:deep(.van-field__body) {
    height: 100%;
}

:deep(.van-field__control) {
    height: 100%;
    font-size: 14px;
    color: #333;
}

:deep(.van-field__control::placeholder) {
    color: #999;
}

:deep(.van-field__right-icon) {
    height: 100%;
    display: flex;
    align-items: center;
    color: #999;
}

.main-container {
    flex: 1;
    display: flex;
    overflow: hidden;
    position: relative;
    z-index: 1;
}

.sidebar {
    width: 90px;
    background-color: #ffffff;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 8px 8px 8px 0;
}

.sidebar-container {
    position: relative;
    min-height: 420px;
    /* 7个州 * 60px */
}

/* 基础灰色背景 */
.sidebar-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f0f0f0;
    border-radius: 0 8px 8px 0;
    z-index: 1;
}

/* 选中状态时的白色间隔 */
.sidebar-divider {
    position: absolute;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #ffffff;
    z-index: 2;
    transition: top 0.3s ease;
}

.sidebar-item {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333333;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    z-index: 3;
}

.sidebar-item.active {
    color: #333333;
    font-weight: 500;
}

/* 上半部分灰色框 */
.upper-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: #f0f0f0;
    border-radius: 0 8px 0 0;
    z-index: 0;
    transition: height 0.3s ease;
}

/* 下半部分灰色框 */
.lower-container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f0f0f0;
    border-radius: 0 0 8px 0;
    z-index: 0;
    transition: height 0.3s ease;
}

.content-area {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #ffffff;
    padding-left: 12px;
    border-left: 1px solid #f5f5f5;
}

.city-list-container {
    padding: 8px 16px 0 0;
}

.region-section {
    margin-bottom: 20px;
}

.region-header {
    margin-bottom: 12px;
    padding: 0;
}

:deep(.region-header .van-cell) {
    padding: 0;
}

:deep(.region-header .van-cell__title) {
    color: #333333;
    font-size: 16px;
    font-weight: 500;
}

:deep(.region-header .van-cell__value) {
    display: flex;
    align-items: center;
}

.more-text {
    font-size: 12px;
    color: #999999;
    margin-right: 4px;
}

.city-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
}

.city-grid.expanded {
    margin-bottom: 24px;
}

:deep(.van-button) {
    height: 32px;
    border-radius: 4px;
    border: none;
    background-color: #f8f8f8;
    color: #666666;
    font-size: 14px;
    padding: 0 12px;
}

:deep(.van-button.selected) {
    background-color: #0094ff;
    color: #ffffff;
}

/* 适配 iPhone X 及以上机型 */
@supports (padding-bottom: constant(safe-area-inset-bottom)) or (padding-bottom: env(safe-area-inset-bottom)) {
    .city-view {
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
}

.search-suggestions {
    position: fixed;
    top: 108px;
    /* 导航栏高度 + 搜索框容器高度 */
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    z-index: 999;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.suggestion-item {
    padding: 16px 20px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;
}

.suggestion-item:active {
    background-color: #f5f5f5;
}

.suggestion-pinyin {
    font-size: 12px;
    color: #999;
    margin-left: 8px;
}

.highlight {
    color: #0094ff;
    font-weight: 500;
}

.city-name {
    font-size: 14px;
    color: #333;
}

.city-pinyin {
    font-size: 12px;
    color: #999;
    margin-left: 8px;
}
</style>
