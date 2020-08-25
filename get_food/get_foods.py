#coding:utf-8

# 目标网页 https://www.meishij.net/zuofa/nongjiaxiaochaorou_59.html

import json
import random
import sys
import urllib2
from bs4 import BeautifulSoup 

reload(sys)
sys.setdefaultencoding('utf8')  

categories = ["家常菜", "快手菜", "下饭菜"]
# categories = ["家常菜", "快手菜", "下饭菜"]
time_zone = ["夜宵"]
# time_zone = ["早餐", "午餐", "晚餐", "夜宵"]
likes = ["明目", "减肥", "增肥", "清热去火", "养胃", "美容"]
# likes = ["减肥-199", "增肥"-224, "清热去火-221", "明目-212", "养胃-251", "美容-198"]
url = "https://www.meishij.net/shiliao.php?st=3&cid=221&sortby=update&page="

def down(url):
    return  urllib2.urlopen(url).read()#读取全部网页


def extract(content, food_id):
    food = {}
    soup = BeautifulSoup(content, "lxml")
    
    food["_id"] = str(food_id)
    food["id"] = str(food_id)
    food["desc"] = soup.select(".materials")[0].select("p")[0].text
    food["title"] = soup.select("#tongji_title")[0].text
    food["category"] = [food["title"], categories[random.randint(0, len(categories)-1)], time_zone[random.randint(0, len(time_zone)-1)], likes[random.randint(0, len(likes)-1)]]
    food["count"] = random.randint(100, 1000)

    food["albums"] = []
    for album in soup.select(".swiper-wrapper")[0].select("img"):
        food["albums"].append(album.get("src"))

    steps = soup.select(".measure")[0].select(".c")
    food["steps"] = []
    for step in steps:
        step_dict = {
            "step": step.select("p")[0].text,
            "img": step.select("img")[0].get("src")
        }

        food["steps"].append(step_dict)

    food["ingredients"] = ""
    ingredients = soup.select(".materials")[0].select(".c")
    for ingredient in ingredients:
        ingredient_name = ingredient.select("a")[0].text
        ingredient_usage = ingredient.select("span")[0].text
        food["ingredients"] = food["ingredients"] + ingredient_name + "," + ingredient_usage + ";"


    food["burden"] = ""
    burdens = soup.select(".fuliao")[0].select("li")
    for burden in burdens:
        burden_name = burden.select("a")[0].text
        burden_usage = burden.select("span")[0].text
        food["burden"] = food["burden"] + burden_name + "," + burden_usage + ";"

    return food


def get_detail_url(url):
    soup = BeautifulSoup(down(url), "lxml")
    detail_urls = []
    for a in soup.select(".listtyle1"):
        detail_urls.append(a.select("a")[0].get("href"))
    return detail_urls

def write2file(path, food):
    f = open(path, 'a')
    f.write('\n' + food)
    f.close()



# 起始id
food_id = 2000
page =1000
for i in range(0, page):
    detail_urls = get_detail_url(url + str(i))
    for detail_url in detail_urls:
        food_id += 1
        print detail_url
        print food_id
        try:
            write2file("/Users/hexarthur/Sites/pythoncrawler/foods4.json", json.dumps(extract(down(detail_url), food_id), encoding="UTF-8", ensure_ascii=False))
        except:
            continue







