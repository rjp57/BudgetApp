

from flask import Flask, render_template, request
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)
api = Api(app)

app.config.update(dict(SEND_FILE_MAX_AGE_DEFAULT=0))

CATEGORIES = {}

PURCHASES = {}


@app.route("/")
def root_page():
	return render_template("homepage.html")


class Category(Resource):
	

	def delete(self, cat_id):
		
		del CATEGORIES[cat_id]
		return '', 204

	



class CategoryList(Resource):
	def get(self):
		return CATEGORIES

	def post(self):
		
		cat_id = request.form['category']
		amount = request.form['amount']
		CATEGORIES[cat_id] = amount
		return cat_id, 201
		
		




class PurchaseList(Resource):
	def get(self):
		return PURCHASES

	def post(self):
		purchase_id = request.form['purchase']
		cat_id = request.form['category']
		
		if cat_id in CATEGORIES:
			PURCHASES[cat_id] = purchase_id
			CATEGORIES[cat_id] = int(CATEGORIES[cat_id]) - int(purchase_id)
			return purchase_id, 201		
		else:
			return purchase_id, 403


api.add_resource(CategoryList, '/cats')
api.add_resource(Category, '/cats/<cat_id>')
api.add_resource(PurchaseList, '/purchases')


if __name__ == '__main__':
	app.run(debug=True)
