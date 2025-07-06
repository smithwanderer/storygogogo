# Dramas.json 字段说明

## 剧集基本信息
- `id`: 剧集唯一标识符，用于区分不同的剧集
- `title`: 剧集标题，显示在界面上的名称
- `description`: 剧集描述，简短介绍剧集内容
- `coverUrl`: 剧集封面图片路径，显示在剧集列表中的大图
- `thumbnailUrl`: 剧集缩略图路径，用于小尺寸显示

## 分类和标签
- `category`: 剧集分类
  - `"trending"`: 热门🔥，会显示在"Trending"区域
  - `"recommended"`: 推荐👍，会显示在"Best Choice"区域
- `isHot`: 是否为热门剧集，true表示会显示🔥标识
- `isExclusive`: 是否为独家剧集，true表示会显示"独家"标签
- `isRecommended`: 是否为推荐剧集

## 集数信息
- `totalEpisodes`: 剧集总集数
- `freeEpisodes`: 免费观看的集数，超过这个数量需要VIP
- `episodes`: 剧集的所有分集信息数组

## 分集信息 (episodes数组中的对象)
- `episodeNumber`: 集数编号，从1开始
- `title`: 该集的标题
- `videoUrl`: 视频文件路径
- `duration`: 视频时长，单位为秒
- `requiresVip`: 是否需要VIP才能观看，false表示免费

## 示例说明
- 前3集通常设置为免费 (`requiresVip: false`)
- 第4集开始需要VIP (`requiresVip: true`)
- 热门剧集使用 `"category": "trending"` 和 `"isHot": true`
- 推荐剧集使用 `"category": "recommended"` 和 `"isRecommended": true`