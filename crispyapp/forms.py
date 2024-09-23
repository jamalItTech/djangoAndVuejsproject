from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.forms import ModelForm

from django import forms
from django.utils.safestring import mark_safe
import uuid

class SimpleForm(forms.ModelForm):  # تغيير الوراثة إلى forms.ModelForm
    
    def get_react_app_js(self, app_id, data):
        """
        Generate JavaScript for React app.
        """
        data_s = ",\n".join([f"{key}: '{value}'" for key, value in data.items()])
        base_react_app = f"""
    <script>
    class {app_id} extends React.Component {{
        constructor(props) {{
            super(props);
            this.state = {{
                {data_s}
            }};
        }}
        
        render() {{
            return (
                <div id="{app_id}">
                    <Form />
                </div>
            );
        }}
    }}

    ReactDOM.render(<{app_id} />, document.getElementById('{app_id}'));
    </script>
    """
        return mark_safe(base_react_app)

    def submit_button(self):
        """
        Render submit button.
        """
        return '<input type="submit">'

    def as_element(self):
        """
        Return this form rendered as HTML elements.
        """
        return self._html_output(
            normal_row='<div %(html_class_attr)s>%(label)s %(field)s%(help_text)s</div>',
            error_row='%s',
            row_ender='</div>',
            help_text_html=' <span class="helptext">%s</span>',
            errors_on_separate_row=True,
            flag=True
        )

    def _html_output(self, normal_row, error_row, row_ender, help_text_html, errors_on_separate_row, flag=False):
        """
        Output HTML for the form.
        """
        top_errors = self.non_field_errors()  # Errors that should be displayed above all fields.
        output, hidden_fields = [], []

        for name, field in self.fields.items():
            html_class_attr = ''
            bf = self[name]
            if flag:
                bf.field.widget.flag = True
            bf_errors = self.error_class(bf.errors)
            if bf.is_hidden:
                if bf_errors:
                    top_errors.extend(
                        [f'(Hidden field {name}) {str(e)}' for e in bf_errors]
                    )
                hidden_fields.append(str(bf))
            else:
                css_classes = bf.css_classes()
                if css_classes:
                    html_class_attr = ' class="%s"' % css_classes

                if errors_on_separate_row and bf_errors:
                    output.append(error_row % str(bf_errors))

                if bf.label:
                    label = forms.utils.conditional_escape(bf.label)
                    label = bf.label_tag(label) or ''
                else:
                    label = ''

                if field.help_text:
                    help_text = help_text_html % field.help_text
                else:
                    help_text = ''

                output.append(normal_row % {
                    'errors': bf_errors,
                    'label': label,
                    'field': bf,
                    'help_text': help_text,
                    'html_class_attr': html_class_attr,
                    'css_classes': css_classes,
                    'field_name': bf.html_name,
                })

        if top_errors:
            output.insert(0, error_row % top_errors)
        if hidden_fields:
            str_hidden = ''.join(hidden_fields)
            if output:
                last_row = output[-1]
                if not last_row.endswith(row_ender):
                    last_row = (normal_row % {
                        'errors': '',
                        'label': '',
                        'field': '',
                        'help_text': '',
                        'html_class_attr': html_class_attr,
                        'css_classes': '',
                        'field_name': '',
                    })
                    output.append(last_row)
                output[-1] = last_row[:-len(row_ender)] + str_hidden + row_ender
            else:
                output.append(str_hidden)

        if flag:
            app_id = "x" + str(uuid.uuid4())[0:5]
            output.insert(0, f"<div id='{app_id}'>")
            output.append('</div>')
            output.append(self.get_vue_app_js(app_id, self.data))
        return mark_safe('\n'.join(output))


