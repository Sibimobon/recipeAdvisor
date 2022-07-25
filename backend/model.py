
from pulp import *
import json
import sys
# defining list of products

food = json.loads(sys.argv[1])
prot_min = float(sys.argv[2])
cal_max = float(sys.argv[3])

recipes = []
calories = {}
protein = {}

for item in food:
    # now song is a dictionary
    recipes.append(item["name"])
    protein[item["name"]] = item["protein"]
    calories[item["name"]] = item["calories"]
    #protein[item["name"]].append(item["protein"])


# Good practice to first define your problem
my_lp_program = LpProblem('My_LP_Problem', LpMinimize)  

# ~~>You do not need bounds for binary variables, they are automatically 0/1
recipes_var=LpVariable.dicts("Recipe", recipes, cat='Binary')

my_lp_program += LpAffineExpression([(
    recipes_var[x], calories[x])  for x in recipes])

my_lp_program += lpSum(recipes_var) == 1, "Only_One_Rec"

# User Input Prot, Cal
my_lp_program += lpSum([(
    protein[x] * recipes_var[x])  for x in recipes]) >= prot_min, "Prot_Const"

my_lp_program += lpSum([(
    calories[x] * recipes_var[x])  for x in recipes]) <= cal_max, "Cal_Const"

my_lp_program.solve()

# print("Status:", LpStatus[my_lp_program.status])
# 

print("-SEPERATOR-")
optimum = value(my_lp_program.objective)

res = {
    "optimum": optimum,
}

# print("Total Optimum=", value(my_lp_program.objective))

for v in my_lp_program.variables():
    # print(v.name, "=", v.varValue)
    res[v.name] = v.varValue

print(res)


sys.stdout.flush()